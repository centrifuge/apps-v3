import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { AppKitProvider } from '@centrifuge/config'
import { centrifuge } from './centrifuge'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Centrifuge Launchpad</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <AppKitProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} centrifugeConfig={centrifuge}>
      <Outlet />
    </AppKitProvider>
  )
}
