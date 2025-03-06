import { createBrowserRouter } from "react-router-dom"
import { lazy } from "react"
import { publicOnlyGuard, userRouteGuard } from "./guard"
import { client } from "./client"
import { API_CONFIG } from "./config/api"

const DefaultLayout = lazy(() => import("./pages/Layout/DefaultLayout"))
const App = lazy(() => import("./pages/Landing/App"))
const Login = lazy(() => import("./pages/Auth/Login"))
const SignUp = lazy(() => import("./pages/Auth/signUp"))
const SignIn = lazy(() => import("./pages/Auth/signIn"))
const Manage = lazy(() => import("./pages/InstanceList/manage"))
const CreateInstance = lazy(() => import("./pages/InstanceCreate/createInstance"))
const Billing = lazy(() => import("./pages/User/Billing/billing"))
// const Setting = lazy(() => import("./pages/InstanceSetting/setting"))
const InstanceSetting = lazy(() => import("./pages/InstanceSetting/InstanceSetting"))
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
        element: <Billing />,
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
            element: <Manage />,
          },
          {
            path: "create",
            element: <CreateInstance />,
          },
          {
            path: ":instanceName",
            children: [
              {
                index: true,
                element: <Setting />,
              },
            ],
          },
        ],
      },
    ],
  },
];

client.setConfig(API_CONFIG)

const router = createBrowserRouter(routes);

export default router;