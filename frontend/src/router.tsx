import { createBrowserRouter } from "react-router-dom"
import { lazy } from "react"
import { publicOnlyGuard, userRouteGuard } from "./guard"
import { client } from "./client"
import { API_CONFIG } from "./config/api"

const DefaultLayout = lazy(() => import("./components/Layout/DefaultLayout"))
const App = lazy(() => import("./pages/Landing/App"))
const Login = lazy(() => import("./pages/Auth/Login"))
const SignUp = lazy(() => import("./pages/Auth/signUp"))
const InstanceListPage = lazy(() => import("./pages/Instance/InstanceListPage"))
const InstanceCreatePage = lazy(() => import("./pages/Instance/InstanceCreatePage"))
const InstanceSettingPage = lazy(() => import("./pages/Instance/InstanceSettingPage"))
const UserBillingPage = lazy(() => import("./pages/User/UserBillingPage"))
const Support = lazy(() => import("./pages/User/support"))

/**
 * Route configuration with authentication guards
 * 
 * These guards run before the route renders and handle redirects
 * while working with our existing UserContext
 */
const routes = [
  {
    index: true,
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
    loader: publicOnlyGuard,
  },
  {
    path: "/signup",
    element: <SignUp />,
    loader: publicOnlyGuard,
  },
  {
    path: "/user/:userName",
    element: <DefaultLayout />,
    loader: userRouteGuard,
    children: [
      {
        path: "billing",
        element: <UserBillingPage />,
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "setting",
        element: <>{/* User setting page */}</>,
      },
      {
        path: "instance",
        children: [
          {
            index: true,
            element: <InstanceListPage />,
          },
          {
            path: "create",
            element: <InstanceCreatePage />,
          },
          {
            path: ":instanceName",
            children: [
              {
                index: true,
                element: <InstanceSettingPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]

client.setConfig(API_CONFIG)

const router = createBrowserRouter(routes)

export default router