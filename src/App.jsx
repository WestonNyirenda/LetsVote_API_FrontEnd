import React from 'react'
import { ThemeProvider } from './contexts/theme-context'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// // Import your pages/components here
 import Layout from './routes/layout'

import DashboardPage from './routes/Dashboard/page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'Analytics',
        element: <h1>Analytics</h1>,
      },
      {
        path: 'Customers',
        element: <h1 className="title">Customers</h1>,
      },
    ],
  },
])

const App = () => {
  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
