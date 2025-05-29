import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/totes_/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/totes_/new"!</div>
}
