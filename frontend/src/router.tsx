import { createBrowserRouter } from "react-router-dom"
import { lazy } from "react"
import DefaultLayout from "./pages/Layout/DefaultLayout"

const App = lazy(() => import("./pages/Landing/App"))
const SignUp = lazy(() => import("./pages/Auth/signUp"))
const SignIn = lazy(() => import("./pages/Auth/signIn"))
const Manage = lazy(() => import("./pages/InstanceList/manage"))
const CreateInstance = lazy(() => import("./pages/Instance/Create/createInstance"))
const Billing = lazy(() => import("./pages/User/Billing/billing"))
// const Setting = lazy(() => import("./pages/InstanceSetting/setting"))
const InstanceSetting = lazy(() => import("./pages/InstanceSetting/InstanceSetting"))
const Support = lazy(() => import("./pages/User/support"))

// TODO:
// - Need to put page layout to element of parent path
// - Update navigation path in all components

const router = createBrowserRouter([
  {
    index: true,
    element: <App />,
  },
  {
    path: "/signup", 
    element: <SignUp />,  
  },
  {
    path: "/signin", 
    element: <SignIn />,  
  },
  {
    path: "/user/:userName",
    element: <DefaultLayout />,
    children: [
      {
        path: "billing",
        element: <Billing />,
      },
      {
        path: "support",
        element: <Support />
      },
      {
        path: "setting",
        element: <>{/* User setting page */}</>
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
                element: <InstanceSetting />,
              }
            ]
          }
        ]
      }
    ]
  }

])

export default router
