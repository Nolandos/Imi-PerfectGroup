import { StrictMode } from 'react'
import "./assets/index.css"
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { AuthProvider } from './lib/auth.provider'
import NotFoundPage from './components/NotFoundPage'
import { globalStore as useGlobalStore } from './lib/global.store'
import ErrorComponent from './components/ErrorComponents'
import { Spinner } from './components/Spinner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60
    },
  },
})

// Create a new router instance
const router = createRouter({
  routeTree, context: {
    auth: useGlobalStore.getState().auth,
    queryClient: queryClient
  },
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Spinner />
    </div>
  ),
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorComponent
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useGlobalStore(state => state.auth)
  const queryClient = useQueryClient()
  return <RouterProvider router={router} context={{ auth, queryClient }} />
}

// Render the app
const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
