import { Link } from "@tanstack/react-router"

export default function NotFoundPage() {
  return (

    <div className="h-screen text-primary-foreground w-screen bg-primary flex justify-center content-center flex-wrap">
      <p className="font-sans text-[130px] md:text-[130px]">Zgubiłeś się? </p>
      <div className="absolute w-screen bottom-0 mb-6 text-center font-sans text-xl">
        <span className="opacity-50">Wracam do </span>
        <Link className="border-b" to="/login">aplikacji</Link>
      </div>
    </div>
  )
}
