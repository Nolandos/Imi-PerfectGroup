import { createFileRoute, useNavigate } from '@tanstack/react-router'
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bucket } from '@/lib/bucket';
import { queryOptions } from '@tanstack/react-query';
import { globalStore } from '@/lib/global.store';


const photosQuery = (albumID: string, photoID: string) => queryOptions({
  queryKey: ['albums', albumID, photoID],
  queryFn: async () => {
    const supabase = globalStore.getState().auth.supabase;
    if (!supabase) {
      throw new Error('no supabase')
    }
    const { data } = await supabase.storage.from(bucket)
      .createSignedUrl(`${albumID}/${photoID}`, 60)
    if (!data) return []
    return [{ src: data.signedUrl }]
  }
})


export const Route = createFileRoute('/_app/albums/$albumID/$photoID')({
  component: AlbumsAlbumIDPhotoID,
  loader: async ({ context, params }) => context.queryClient.ensureQueryData(photosQuery(params.albumID, params.photoID)),
})

function AlbumsAlbumIDPhotoID() {
  const params = Route.useParams()
  const navigate = useNavigate()
  const { photos } = Route.parentRoute.useLoaderData()
  const currentPhotos = Route.useLoaderData()
  const data = useMemo(() => {
    const indexPhoto = photos.findIndex(p => p.path.includes(params.photoID))
    const prevIndex = indexPhoto - 1 < 0 ? photos.length - 1 : indexPhoto - 1;
    const nextIndex = photos.length - 1 < indexPhoto + 1 ? 0 : indexPhoto + 1;
    const nextPhoto = photos[nextIndex].path.split("/")[1]
    const prevPhoto = photos[prevIndex].path.split("/")[1]
    return { prevPhoto, nextPhoto }
  }, [photos, params.photoID])
  const handleClose = () => {
    navigate({
      to: `/albums/$albumID`,
      params: {
        albumID: params.albumID
      }
    })
  }
  return (
    <Lightbox render={{
      buttonPrev: () => (
        <button className='yarl__button yarl__navigation_prev' onClick={() => {
          navigate({
            to: `/albums/$albumID/$photoID`,
            params: {
              albumID: params.albumID,
              photoID: data.prevPhoto
            }
          })
        }}><ChevronLeft /></button>
      ),
      buttonNext: () => (
        <button className='yarl__button yarl__navigation_next' onClick={() => {
          navigate({
            to: `/albums/$albumID/$photoID`,
            params: {
              albumID: params.albumID,
              photoID: data.nextPhoto
            }
          })
        }}><ChevronRight /></button>
      ),

    }} open={true} close={handleClose} slides={currentPhotos} />
  )
}
