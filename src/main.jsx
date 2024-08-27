import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"

import ErrorPage from './error-page.jsx'
import ExperimentPage from './routes/experimentPage.jsx'
import CreateExperimentPage from './routes/experimentCreatePage.jsx'
import EditExperimentPage from './routes/experimentEditPage.jsx'
import UserPage from './routes/userPage.jsx'
import CreateUserPage from './routes/userCreatePage.jsx'
import EditUserPage from './routes/userEditPage.jsx'
import HomePage from './routes/homePage.jsx'
import LoginPage from './routes/loginPage.jsx'
import RegisterPage from './routes/registerPage.jsx'
import ExperimentControlPage from './routes/experimentControlPage.jsx'
import Error401Page from './error-401-page.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import RobotPage from './routes/robotPage.jsx'
import CreateRobotPage from './routes/robotCreatePage.jsx'
import EditRobotPage from './routes/robotEditPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "experiments",
        element: <ExperimentPage />,
      },
      {
        path: "experiments/create-experiment",
        element: <CreateExperimentPage />,
      },
      {
        path: "experiments/edit-experiment/:id",
        element: <EditExperimentPage />,
      },
      {
        path: "experiments/:id/control",
        element: <ExperimentControlPage />
      },
      {
        path: "admin/robots",
        element: <ProtectedRoute element={<RobotPage />} allowedRoles={['Administrador']} />,
      },
      {
        path: "admin/robots/create-robot",
        element: <ProtectedRoute element={<CreateRobotPage />} allowedRoles={['Administrador']} />,
      },
      {
        path: "admin/robots/edit-robot/:id",
        element: <ProtectedRoute element={<EditRobotPage />} allowedRoles={['Administrador']} />,
      },
      {
        path: "admin/users",
        element: <ProtectedRoute element={<UserPage />} allowedRoles={['Administrador']} />,
      },
      {
        path: "admin/users/create-user",
        element: <ProtectedRoute element={<CreateUserPage />} allowedRoles={['Administrador']} />,
      },
      {
        path: "admin/users/edit-user/:id",
        element: <ProtectedRoute element={<EditUserPage />} allowedRoles={['Administrador']} />,
      },
      {
        path: "users/login",
        element: <LoginPage />,
      },
      {
        path: "users/register",
        element: <RegisterPage />,
      },
      {
        path: "documentation",
      },
      {
        path: "contact"
      },
      {
        path: "error-401",
        element: <Error401Page />,
      },
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
