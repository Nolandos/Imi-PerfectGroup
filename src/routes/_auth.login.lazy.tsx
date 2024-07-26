import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Globe, ShieldQuestion } from 'lucide-react'
import { createLazyFileRoute, useNavigate, Link, getRouteApi } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from '@/components/ui/use-toast'
import { globalStore } from '@/lib/global.store'

interface Inputs {
  email: string
  password: string
}

export const Route = createLazyFileRoute('/_auth/login')({
  component: LoginPage
})

const routeApi = getRouteApi('/_auth')

function LoginPage() {
  const search = routeApi.useSearch()
  const supabase = globalStore(state => state.auth.supabase)
  const navigate = useNavigate()
  const { register, handleSubmit, watch } = useForm<Inputs>()
  const email = watch("email")
  const handleLogin = async (data: Inputs) => {
    if (!supabase) return
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      toast({
        title: "Błąd logowania",
        description: "Mamy problem z logowaniem, spróbuj ponownie, może złe hasło ?",
        className: 'bg-red-300 text-white'
      })
      return
    }
    await navigate({
      to: search?.returnTo ? search.returnTo : '/albums',
      replace: true
    })
  }
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Witamy!</h1>
        <p className="text-balance text-muted-foreground">
          Podaj swoje dane logowania do naszej grupy
        </p>
      </div>
      <form onSubmit={handleSubmit(async (data) => {
        handleLogin(data)
      })}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Bezpieczne hasło</Label>
            </div>
            <Input {...register("password")} id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button type="button" onClick={async () => {
            if (!email) {
              toast({
                title: "Błąd",
                description: "Podaj email aby zresetować hasło",
                className: 'bg-red-300 text-white'
              })
              return
            }
            const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (emailRegEx.test(email) === false) {
              toast({
                title: "Błąd",
                description: "Podaj poprawny email",
                className: 'bg-red-300 text-white'
              })
              return
            }
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/password`
            })
            if (error) {
              toast({
                title: "Błąd",
                description: "Może już wysłałeś prośbę o reset",
                className: 'bg-red-300 text-white'
              })
              return
            }
            toast({
              title: "Reset hasła",
              description: "Sprawdź skrzynkę email",
              className: 'bg-green-800 text-white'
            })
          }} variant="secondary" className="w-full">
            <ShieldQuestion className="h-5 w-5 mr-2" />
            Oj, nie pamiętam hasła
          </Button>
          <Button disabled variant="outline" className="w-full">
            <Globe className="h-5 w-5 mr-2" />
            Użyj konta Google
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Nie masz jeszcze konta?{" "}
        <Link to="/register" className="underline">
          Zapisz się
        </Link>
      </div>
    </div>
  )
}
