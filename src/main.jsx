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
        path: "users",
        element: <UserPage />,
      },
      {
        path: "users/create-user",
        element: <CreateUserPage />,
      },
      {
        path: "users/edit-user/:id",
        element: <EditUserPage />,
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
    <RouterProvider router={router} />
  </React.StrictMode>,
)
