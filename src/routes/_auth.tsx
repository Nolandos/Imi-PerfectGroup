import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

type AuthSearch = {
  returnTo?: string
}

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  validateSearch: (params: Record<string, unknown>): AuthSearch => {
    return {
      returnTo: typeof params.returnTo === 'string' ? params.returnTo : undefined
    }
  },
  beforeLoad: ({ context }) => {
    if (context.auth.session) {
      if (context.auth.supabase) {
        context.auth.supabase.from("profiles")
          .select("active")
          .eq("user_id", context.auth.session.user.id).single().then(({ data }) => {

            throw redirect({
              to: data?.active ? '/albums' : "/activation",
            })
          })
      }
    }
  },
})

function AuthLayout() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]" >
      <div className="flex items-center justify-center py-12">
        <Outlet />
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/photo_login.jpg"
          alt="Image"
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div >
  )
}
