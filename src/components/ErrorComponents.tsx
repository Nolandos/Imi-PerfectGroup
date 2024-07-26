import { type ErrorRouteComponent, Link, useRouter } from "@tanstack/react-router"



const ErrorComponent: ErrorRouteComponent = (props) => {
  const router = useRouter()
  function resetHandler() {
    props.reset()
    router.invalidate()
  }
  return (
    <div className="text-muted-foreground w-full bg-muted flex gap-2 justify-center content-center flex-wrap p-4">
      <p className="font-sans text-[130px] md:text-[130px]">Jakiś błąd? </p>
      {props.error && props.error instanceof Error ?
        <p className="border border-red-500 rounded-md p-8 text-center w-full">{props.error.message}</p>
        : null}
      <p className="opacity-70">Nie martw się i {" "}</p>
      <Link className="border-b" href="#" onClick={resetHandler}>wróć do bezpieczeństwa</Link>
    </div>
  )
}

export default ErrorComponent
