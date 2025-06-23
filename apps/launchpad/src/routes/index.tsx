import { useLoaderData } from 'react-router-dom'

export async function loader() {
  return { time: new Date().toLocaleTimeString() }
}

export default function Home() {
  let { time } = useLoaderData() as { time: string }
  return (
    <div>
      <h1>Launchpad</h1>
      <p>Loaded at: {time}</p>
    </div>
  )
}
