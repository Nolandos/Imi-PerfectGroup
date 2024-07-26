import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { AuthContext } from '@/lib/auth.context'
import { Toaster } from "@/components/ui/toaster"
import type { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  auth: AuthContext
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: async (ctx) => {
    ctx.context
  },
  component: RootComponent
})

function RootComponent() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}
