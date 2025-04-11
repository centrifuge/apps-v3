import { Navigate, createHashRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { FabricProvider } from '@centrifuge/fabric'
import { Head } from './components/Head'
import { LayoutBase } from './components/LayoutBase'
import './App.css'
import { AboutPage } from './pages/About'
import { NotFoundPage } from './pages/NotFound'
import { config } from './config'

const router = createHashRouter([
  {
    path: '/',
    element: <LayoutBase />,
    children: [
      {
        path: '/',
        element: <Navigate to="/home" replace />,
      },
      {
        path: '/dashboard/*',
        element: <AboutPage />,
        handle: { component: AboutPage },
      },
      { path: '*', element: <NotFoundPage />, handle: { component: NotFoundPage } },
    ],
    errorElement: <NotFoundPage />,
  },
])

export function Root() {
  return (
    <>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <FabricProvider theme={config.themes.light}>
          <RouterProvider router={router} />
      </FabricProvider>
    </>
  )
}

// function Root() {
//   return (
//     <div className="app">
//       <header className="app-header">
//         <h1>Centrifuge App</h1>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/home">Home</Link>
//             </li>
//             <li>
//               <Link to="/about">About</Link>
//             </li>
//           </ul>
//         </nav>
//       </header>
//       <main>
//         <Outlet />
//       </main>
//     </div>
//   );
// }

export default Root
