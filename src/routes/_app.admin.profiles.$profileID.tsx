import { globalStore } from '@/lib/global.store';
import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query';
import {createFileRoute, Link, useRouter} from '@tanstack/react-router'
import {useForm} from "react-hook-form";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "@/components/ui/use-toast.ts";
import {useCallback} from "react";

interface Inputs {
  role: string
  name: string
  surname: string
  active: boolean
}

const adminProfileQuery = (profileID: string) => {
  return {
    queryKey: ['profiles', profileID],
    queryFn: async () => {
      const supabase = globalStore.getState().auth.supabase
      if (!supabase) {
        throw new Error('no supabase')
      }
      const { data } = await supabase.
        from('profiles')
          .select()
          .eq('user_id', profileID)
      if (!data) {
        return { profile: null }
      }
      return { profile: data[0] ?? [] }
    }
  }
}


export const Route = createFileRoute('/_app/admin/profiles/$profileID')({
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(adminProfileQuery(params.profileID))
  },
  component: AdminProfileID
})

function AdminProfileID() {
  const query = useSuspenseQuery(adminProfileQuery(Route.useParams().profileID));
  const profile = query.data?.profile ?? null;
  const params = Route.useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const auth = globalStore(state => state.auth)

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: profile?.name || '',
      surname: profile?.surname || '',
      role: profile?.role || '',
      active: profile?.active
    }
  });

  const handleSaveUser = useCallback(async (data:{name: string, surname: string, active: boolean}, profileID: string) => {
    if (!profileID) {
      throw new Error('No profile id')
    }
    if (!auth.supabase) { return }
    if(profileID) {
      const {name, surname, active} = data;
      const { error } = await auth.supabase
          .from('profiles')
          .update({
            name,
            surname,
            active
          })
          .eq('user_id', profileID)

      if (error) {
        console.log('Error', error)
        toast({
          title: "Wsytąpił błąd",
          description: "Wsytąpił błąd podczas zapisywania",
          className: 'bg-red-300 text-white'
        })
        return
      }

      toast({
        title: "Zaktualizowano pomyślnie",
        description: "Pomyślnie zaktualizowano użytkownika",
        className: 'bg-green-600 text-white'
      })
      router.invalidate();
      queryClient.invalidateQueries();
    }
  }, [auth, router])


  return (
      <div className="w-full flex flex-col items-center gap-y-4">
        <h1>ID Profilu: <b>{profile?.user_id}</b></h1>
        <form
            className="w-full max-w-[500px]"
            onSubmit={handleSubmit(async (data) => {
          handleSaveUser(data, params?.profileID)
        })}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                  {...register("role")}
                  id="role"
                  type="select"
                  placeholder=""
                  required
                  disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  placeholder=""
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                  {...register("surname")}
                  id="surname"
                  type="text"
                  placeholder=""
              />
            </div>
            <div className='flex flex-row gap-2 items-center justify-start'>
              <Input
                  {...register("active")}
                  id="active"
                  type="checkbox"
                  placeholder=""
                  className="w-[25px]"
              />
              <Label htmlFor="active" className='text-xl'>Konto aktywne</Label>
            </div>
            <div className="w-full flex justify-center gap-x-4">
              <Button type="submit" className="w-full">
                Zapisz
              </Button>
            </div>
          </div>
        </form>
        <Button className="p-0 w-full max-w-[500px]">
          <Link className="px-4 py-2 w-full" to={`/admin/profiles`}>
            Anuluj
          </Link>
        </Button>
      </div>
  )
}
