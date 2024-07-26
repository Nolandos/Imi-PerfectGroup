import { bucket } from '@/lib/bucket';
import { globalStore } from '@/lib/global.store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { Gallery } from "react-grid-gallery";

const albumPhotosQuery = (albumID: string) => {
  return {
    queryKey: ['albums', albumID],
    queryFn: async () => {
      const supabase = globalStore.getState().auth.supabase
      if (!supabase) {
        throw new Error('no supabase')
      }
      const { data } = await supabase.
        from('photos').
        select('path').
        eq('event_id', albumID).order('upload_date', { ascending: false })
      if (!data) {
        return { photos: [] }
      }

      const urlsQueries = data.map(photo => new Promise<{ signedUrl: string, path: string }>((resolve, reject) => {
        supabase.storage.from(bucket).createSignedUrl(photo.path, 3600, {
          transform: {
            width: 500,
            height: 350,
            resize: "cover",
            quality: 80
          }
        }).then(response => {
          if (response.data) {
            resolve({
              signedUrl: response.data.signedUrl,
              path: photo.path
            })
          }
          reject('error')
        })
      }))

      const urls = await Promise.all(urlsQueries)

      return { photos: urls?.map(u => ({ src: u.signedUrl, path: u.path, width: 450, height: 350 })) ?? [] }
    }
  }
}


export const Route = createFileRoute('/_app/albums/$albumID')({
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(albumPhotosQuery(params.albumID))
  },
  component: AlbumsAlbumID
})

function AlbumsAlbumID() {
  const navigate = useNavigate()
  const query = useSuspenseQuery(albumPhotosQuery(Route.useParams().albumID))
  const photos = query.data?.photos ?? []
  const params = Route.useParams()
  return (
    <>
      <Gallery images={photos} onClick={(ev) => {
        navigate({
          to: "/albums/$albumID/$photoID",
          params: {
            albumID: params.albumID,
            photoID: photos[ev].path?.split("/")[1]
          }
        })
      }} />
      <Outlet />
    </>
  )
}
