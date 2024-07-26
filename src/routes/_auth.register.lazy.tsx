import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { globalStore } from '@/lib/global.store'
import { createLazyFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

export const Route = createLazyFileRoute('/_auth/register')({
  component: RegisterPage
})

interface Inputs {
  email: string
  password: string
  firstName: string
  lastName: string
}
function RegisterPage() {
  const navigate = useNavigate()
  const form = useForm<Inputs>()
  const {
    handleSubmit,
    setError
  } = form
  const supabase = globalStore(state => state.auth.supabase)
  const registerHandler = useCallback(async (input: Inputs) => {
    if (!supabase) return
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          firstName: input.firstName,
          lastName: input.lastName
        }
      }
    })
    if (error) {
      setError("root", { type: "manual", message: "Coś poszło nie tak" })
      toast({
        title: "Błąd rejestracji",
        description: "Sprawdź poprawność danych",
        className: 'bg-red-300 text-white'
      })
      return
    }
    await navigate({ to: '/confirmation' })

  }, [supabase, setError, navigate])

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Witamy!</h1>
        <p className="text-balance text-muted-foreground">
          Proszę podaj swoje dane, postaramy się zweryfikować twoje zgłoszenie jak najszybciej
        </p>
      </div>
      <Form {...form} >
        <form onSubmit={handleSubmit(registerHandler)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <FormField name="firstName" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twoje Imię</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan" required {...field} />
                    </FormControl>
                  </FormItem>
                )} />
            </div>
            <div className="grid gap-2">
              <FormField name="lastName" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input placeholder="Kowalski" required {...field} />
                    </FormControl>
                  </FormItem>
                )} />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <FormField name="email" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>adres email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@email.com" required type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )} />
            </div>
            <div className="grid gap-2">
              <FormField name="password" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bezpieczne hasło</FormLabel>
                    <FormControl>
                      <Input required type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )} />
            </div>
            <Button type="submit" className="w-full">
              Zarejestruj się
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Masz już konto?{" "}
        <Link to="/login" className="underline">
          Zaloguj się
        </Link>
      </div>
    </div >
  )
}
