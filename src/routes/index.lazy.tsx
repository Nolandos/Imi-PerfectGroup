import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3 className='text-3xl font-sans'>Witajcie w naszej grupce!</h3>
      <p className='text-xl text-current'>
        Mała aplikacja dla naszych zdjęć, zapraszam do{" "}
      </p>
      <Link to="/login">
        logowania się
      </Link>
    </div>
  )
}
