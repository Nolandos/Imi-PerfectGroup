import {globalStore} from '@/lib/global.store'
import {queryOptions, useSuspenseQuery} from '@tanstack/react-query'
import {createFileRoute, Link} from '@tanstack/react-router'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {ReactNode} from "react";
import {Button} from "@/components/ui/button.tsx";


const profilesIndexQuery = () => {
  return queryOptions({
    queryKey: ['profiles'],
    queryFn: async () => {
      const supabase = globalStore.getState().auth.supabase
      if (!supabase) {
        throw new Error('no supabase')
      }
      const { data } = await supabase.from('profiles')
        .select().order("active", { ascending: true })
      if (!data) {
        return { profiles: [] }
      }
      return { profiles: data ?? []}
    }
  })
}


export const Route = createFileRoute('/_app/admin/profiles/')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(profilesIndexQuery())
  },
  component: AdminProfilesIndex,
});


function AdminProfilesIndex() {
  const query = useSuspenseQuery(profilesIndexQuery())
  const { profiles } = query.data;

  const tableHeads:{id: string, name: string, databaseVariable?: string, isIndex?: boolean, booleanOption?: {id: string, value: string | ReactNode}[]}[] = [
      {
        id: 'lp',
        name: 'Lp.',
        isIndex: true,
      },
      {
        id: 'userId',
        name: 'User Id',
        databaseVariable: 'user_id'
      },
      {
        id: 'role',
        name: 'Role',
        databaseVariable: 'role'
      },
      {
        id: 'status',
        name: 'Status',
        databaseVariable: 'active',
        booleanOption: [{
          id: 'true',
          value: <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
        },
          {
            id: 'false',
            value: <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          }]
      }
  ];

  return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-[1420px]">
      <Table>
        <TableHeader>
          <TableRow>
            {[...tableHeads.map(({id, name}) => (<TableHead key={id}>{name}</TableHead>)), <TableHead>Akcje</TableHead>]}
          </TableRow>
        </TableHeader>
        <TableBody>
            {profiles.map((profile) => {
              const contentValue = tableHeads.map(({id, databaseVariable, booleanOption, isIndex}, index) => {
                let value;
                if (isIndex) value = index + 1;
                if (databaseVariable && !booleanOption) value = profile[databaseVariable as keyof typeof profile];
                if (databaseVariable && booleanOption) {
                  const findOption = booleanOption.find(({id: booleanId}) => {
                    return `${profile[databaseVariable  as keyof typeof profile]}` === booleanId
                  });
                  value = findOption?.value;
                }

                return <TableCell key={id}>{value}</TableCell>;
              })

              return (
                  <TableRow key={profile.user_id}>
                    {[
                      ...contentValue,
                      <TableCell>
                        <Button className="p-0">
                          <Link className="px-4 py-2" to={`/admin/profiles/${profile.user_id}`}>
                            Edycja
                          </Link>
                        </Button>
                      </TableCell>
                    ]}
                  </TableRow>
              );
            })}

        </TableBody>
      </Table>
        </div>
    </div>
  )
}
