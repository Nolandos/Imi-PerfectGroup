import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from '@/components/ui/use-toast'
import { globalStore } from '@/lib/global.store'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
export const Route = createFileRoute('/password')({
  beforeLoad: async () => {
    const supabse = globalStore.getState().auth.supabase
    const { data: { user } } = await supabse.auth.getUser()
    if (!user || !user.recovery_sent_at) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: PasswordRecoveryPage,
})

function PasswordRecoveryPage() {
  const supabase = globalStore(state => state.auth.supabase)
  const navigate = useNavigate()
  const form = useForm<{ password: string, confirm: string }>()
  const changePassword = async (data: { password: string, confirm: string }) => {
    if (data.password !== data.confirm) {
      form.setError("confirm", { type: "manual", message: "Hasła nie są takie same" })
      return
    }
    const { error } = await supabase.auth.updateUser({
      password: data.password
    })
    if (error) {
      toast({
        title: "Błąd zmiany hasła",
        description: "Sprawdź poprawność danych",
        className: 'bg-red-300 text-white'
      })
      return
    }
    await supabase.auth.signOut()
    navigate({
      to: '/login',
    })
  }
  return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
      <Card>
        <CardHeader>
          <h1>Zmiana hasła</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(changePassword)}>
              <FormField name="password" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex flex-row justify-between items-center'>Nowe hasło
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className='w-4' />
                          </TooltipTrigger>
                          <TooltipContent className='bg-slate-100 border border-black p-4 rounded-md max-w-sm text-sm'>
                            <p className='font-black'>Hasło musi zawierać co najmniej 8 znaków</p>
                            <p>
                              Nie przejmuj się tym technicznym bełkotem, wymyślać hasło to trudna sprawa, ale pozwól że coś ci pokażę.
                            </p>
                            <p>
                              Jest taki sposób: wybierasz sobie jakieś bliskie sobie słowo, które łatwo zapamiętasz, np.
                              {['kot', 'pies', 'dom', 'kawa', 'herbata', 'samochód', 'rower', 'kino', 'muzyka', 'książka', 'telewizja'][Math.floor(Math.random() * 11)]}
                              {" "}następnie cyfra, może to być ilość znaków w nazwie aplikacji, np. dla słowa "facebook" to 8,
                              a na końcu jakaś litera, np. pierwsza litera nazwy aplikacji, czyli "f".
                              W ten sposób zawsze będziesz pamiętać swoje hasło, do tego dla każdego miejsca będziesz mieć inne hasło, ale na tych samych zasadach,
                              dla przykładu dla "facebook" to będzie "kot8f", dla "twitter" to będzie "kot7t" itd.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" required {...field} />
                    </FormControl>
                  </FormItem>
                )} />
              <FormField name="confirm" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jeszcze raz</FormLabel>
                    <FormControl>
                      <Input type="password" required {...field} />
                    </FormControl>
                  </FormItem>
                )} />
              <Button>Zapisz</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div >

  )
}
