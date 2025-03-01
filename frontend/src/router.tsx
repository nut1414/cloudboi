import { createBrowserRouter } from "react-router-dom"
import { lazy } from "react"

const App = lazy(() => import("./pages/Landing/App"))
const SignUp = lazy(() => import("./pages/Auth/signUp"))
const Manage = lazy(() => import("./pages/InstanceList/manage"))
const CreateInstance = lazy(() => import("./pages/InstanceCreate/createInstance"))
const Billing = lazy(() => import("./pages/Billing/billing"))
const Setting = lazy(() => import("./pages/InstanceSetting/setting"))
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
    path: "/user/:userName",
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
                element: <Setting />,
              }
            ]
          }
        ]
      }
    ]
  }

])

export default router
