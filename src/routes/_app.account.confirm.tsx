import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/account/confirm')({
  component: () => <div>Hello /account/confirm!</div>
})