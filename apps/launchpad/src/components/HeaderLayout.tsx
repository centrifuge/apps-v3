import { Outlet } from 'react-router'

export default function HeaderLayout() {
  return (
    <div>
      <h1>HeaderLayout</h1>
      <Outlet />
    </div>
  )
}
