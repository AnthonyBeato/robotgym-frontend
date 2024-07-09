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

import { AuthProvider } from './context/AuthContext.jsx'
import RobotPage from './routes/robotPage.jsx'
import CreateRobotPage from './routes/robotCreatePage.jsx'
import EditRobotPage from './routes/robotEditPage.jsx'

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
        path: "robots",
        element: <RobotPage />,
      },
      {
        path: "robots/create-robot",
        element: <CreateRobotPage />,
      },
      {
        path: "robots/edit-robot/:id",
        element: <EditRobotPage />,
      },
      {
        path: "admin/users",
        element: <UserPage />,
      },
      {
        path: "admin/users/create-user",
        element: <CreateUserPage  />,
      },
      {
        path: "admin/users/edit-user/:id",
        element: <EditUserPage />,
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
