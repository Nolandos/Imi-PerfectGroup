import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/admin/permissions')({
  component: PermissionsPage
})

function PermissionsPage() {
  return (
    <div className='max-w-md border border-slate-300 p-8 flex flex-col justify-center gap-2 items-center'>
      <h3 className='text-2xl'>Brak uprawnień</h3>
      <p className='text-sm'>Nie posiadasz uprawnień do przestrzeni administratora</p>
      <Link to='/login' className='mt-4 text-blue-500 hover:underline'>Wróć do logowania</Link>
    </div>
  )
}
