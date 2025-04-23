import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/permission')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex w-full min-h-screen text-red-500 text-8xl justify-center items-center'>
      Permission Denied
    </div>
  )
}
