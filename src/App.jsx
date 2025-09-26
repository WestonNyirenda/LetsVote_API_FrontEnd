import React from 'react'
import { ThemeProvider } from './contexts/theme-context'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Signin from './components/Auth/Signin'
import DashboardPage from './routes/Dashboard/page'
import { Navigate } from 'react-router-dom'
import Unauthorized from './components/Auth/unauthorized'
import Layout from './routes/layout'
import Candidates from './pages/Admin/Candidates'
import Elections from './pages/Admin/Elections'
import ElectionDetails from './pages/Admin/ElectionDetails'
import Logout from './components/Auth/Logout'
import WelcomePage from './pages/User/WelcomePage'
import UserLayout  from './routes/UserLayout'
import VotingPage from './pages/User/VotingPage'




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
        path:'ElectionDetails/:id',
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
  },

 {
  path: 'user',
  element: (
    <ProtectedRoute allowedRoles={['User']}>
      <UserLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true, // default route inside UserLayout
      element: <WelcomePage />
    },
    {
      path: 'VotingPage/:electionId',
      element: <VotingPage/>
    },
    {
      path: 'settings',
      element: <h1>User Settings Page</h1>
    }
  ]
},

 
  {
    path:'Logout',
    element: <Logout/>
  },
  
])

const App = () => {
  return (
     <ThemeProvider storageKey="theme">
    
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
 
    </ThemeProvider>
  )
}

export default App
