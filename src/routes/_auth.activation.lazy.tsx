import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/activation')({
  component: ActivationPage
})

function ActivationPage() {
  return (
    <div className='max-w-md border border-slate-300 p-8 flex flex-col justify-center gap-2 items-center'>
      <h3 className='text-2xl'>Oczekiwanie na aktywację konta</h3>
      <p className='text-sm'>Proszę czekać na aktywację konta przez administratora</p>
      <Link to='/login' className='mt-4 text-blue-500 hover:underline'>Wróć do logowania</Link>
    </div>
  )
}
