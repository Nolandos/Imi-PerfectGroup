import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/confirmation')({
  component: ActivationPage
})

function ActivationPage() {
  return (
    <div className='max-w-md border border-slate-300 p-8 flex flex-col justify-center gap-2 items-center'>
      <h3 className='text-2xl'>Proszę potwierdzić adres email</h3>
      <p className='text-sm'>Na twój adres przesłaliśmy e-mail, proszę o kliknięcie w link który można tam znaleźć</p>
      <Link to='/login' className='mt-4 text-blue-500 hover:underline'>a następnie zalogować się</Link>
    </div>
  )
}
