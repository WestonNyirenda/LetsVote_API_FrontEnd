import React from 'react'
import { ThemeProvider } from './contexts/theme-context'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signin from './components/Auth/Signin'
import DashboardPage from './routes/Dashboard/page'
import { Navigate } from 'react-router-dom'
import Unauthorized from './components/Auth/unauthorized'
import Layout from './routes/layout'
import Candidates from './pages/Admin/Candidates'
import Elections from './pages/Admin/Elections'
import ElectionDetails from './pages/Admin/ElectionDetails'


 //Protecting routes with authorization

 const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // if (allowedRoles && !allowedRoles.includes(role)) {
  //   return <Navigate to="/Unauthorized" replace />;
  // }

  return children;
};



const router = createBrowserRouter([

  {
    path:'/',
    element:<Signin/>
  },
   
  {
    path: 'Dashboard',
    element: ( 

      <ProtectedRoute allowedRoles={['Admin']}>
        <Layout />
      </ProtectedRoute>
      
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'Candidates',
        element: <Candidates/>,
      },
       {
        path: 'Elections',
        element: <Elections/>,
      },

      {
        path:'ElectionDetails',
        element: <ElectionDetails/>
      },
      {
        path: 'Customers',
        element: <h1 className="title">Customers</h1>,
      },
    ],
  },
  {
    path: '/Unauthorized', 
    element: <Unauthorized />
  },

  {
    path:'ElectionDetails',
    element: <ElectionDetails/>
  }
])

const App = () => {
  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
