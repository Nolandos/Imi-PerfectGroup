import ChangeTitle from '@/components/ChangingTitle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { bucket } from '@/lib/bucket'
import { globalStore } from '@/lib/global.store'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'


const albumsIndexQuery = () => {
  return queryOptions({
    queryKey: ['albums'],
    queryFn: async () => {
      const supabase = globalStore.getState().auth.supabase
      if (!supabase) {
        throw new Error('no supabase')
      }
      const { data } = await supabase.from('events')
        .select('id, description, created_at, photos(path), counted:photos(count)').limit(1, { referencedTable: "photos" })
        .order("created_at", { ascending: false })
      if (!data) {
        return { events: [], previewPhotos: [] }
      }
      const previews = data.map(event => {
        const preview = event.photos[0]
        const photosCount = event.counted[0].count
        return new Promise<{ photo: string, eventID: string, count: number }>((resolve, reject) => {
          supabase.storage.from(bucket).createSignedUrl(preview.path, 60, {
            transform: {
              width: 600,
              height: 600,
              resize: "cover",
              quality: 80
            }
          }).then(response => {
            if (response.data) {
              resolve({
                photo: response.data.signedUrl,
                eventID: event.id,
                count: photosCount
              })
            }
            reject('error')
          })
        })
      })
      const resolved = await Promise.all(previews)
      return { events: data ?? [], previewPhotos: resolved }
    }
  })
}


export const Route = createFileRoute('/_app/albums/')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(albumsIndexQuery())
  },
  component: AlbumsIndex
})


function AlbumsIndex() {
  const query = useSuspenseQuery(albumsIndexQuery())
  const { events, previewPhotos } = query.data
  const router = useRouter()
  const supabase = globalStore(state => state.auth.supabase)
  const handleNameChange = useCallback(async (id: string, title: string) => {
    if (!supabase) return
    await supabase.from('events').update({ description: title }).eq('id', id)
    router.invalidate()
  }, [supabase, router])
  const role = globalStore(state => state.auth.role)
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl'> Nasze wydarzenia  </h2>
        {role === 'uploader' ? <Button ><Link to='/albums/upload'>Dodaj </Link></Button> : null}
      </div>
      <ul className='grid grid-cols-1 gap-4 m-8 md:grid-cols-2 lg:grid-cols-4'>
        {events.map((event) => (
          <li key={event.id}>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle><ChangeTitle canChange={role === 'uploader'} title={event.description ?? "Nowe wydarzenie"} onChange={(title) => {
                  handleNameChange(event.id, title)
                }} /></CardTitle>
                <CardDescription>{new Date(event.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {previewPhotos.find(p => p.eventID === event.id) ?
                  <img className='aspect-square object-cover' src={previewPhotos.find(p => p.eventID === event.id)?.photo} /> : null}
              </CardContent>
              <CardFooter className='flex flex-col gap-4'>
                <Link className='bg-primary text-primary-foreground px-4 py-2' to={`/albums/$albumID`} params={{
                  albumID: event.id
                }}>Zobacz {event.counted[0].count} zdjęć</Link>
                {role === 'uploader' ? <Link className='bg-secondary text-secondary-foreground px-4 py-2' to={`/albums/edit/$albumID`} params={{
                  albumID: event.id
                }} >Dodaj kolejne zdjęcia</Link> : null}
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
