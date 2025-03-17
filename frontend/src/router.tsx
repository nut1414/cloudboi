import { createBrowserRouter } from "react-router-dom"
import { lazy } from "react"
import { publicOnlyGuard, userRouteGuard } from "./guard"
import { client } from "./client"
import { API_CONFIG } from "./config/api"

const DefaultLayout = lazy(() => import("./pages/Layout/DefaultLayout"))
const App = lazy(() => import("./pages/Landing/App"))
// const Login = lazy(() => import("./pages/Auth/Login"))
const SignUp = lazy(() => import("./pages/Auth/signUp"))
const SignIn = lazy(() => import("./pages/Auth/signIn"))
const Manage = lazy(() => import("./pages/Instance/List/manage"))
const CreateInstance = lazy(() => import("./pages/Instance/Create/createInstance"))
const Billing = lazy(() => import("./pages/User/Billing/billing"))
// const Setting = lazy(() => import("./pages/InstanceSetting/setting"))
const InstanceSetting = lazy(() => import("./pages/Instance/Setting/InstanceSetting"))
const Support = lazy(() => import("./pages/User/support"))


//admin
const Package = lazy(() => import("./pages/Admin/Package/package"))
const CreatePackage = lazy(() => import("./pages/Admin/Package/createPackage"))
const EditPackage = lazy(() => import("./pages/Admin/Package/editPackage"))
const BillingAdmin = lazy(() => import("./pages/Admin/Billing/billing"))

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
    element: <SignIn />,
    loader: publicOnlyGuard,
  },
  {
    path: "/register",
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
            path: ":instanceId",
            element: <InstanceSetting />,
          },
          {
            path: "create",
            element: <CreateInstance />,
          },
        ],
      },
    ],
  },

  //admin
  {
    path: "/admin/:userName",
    element: <DefaultLayout />,
    loader: userRouteGuard,
    children: [
      {
        path: "billing",
        element: <BillingAdmin />,
      },
      {
        path: "package",
        children: [
          {
            index: true,
            element: <Package />,
          },
          {
            path: "create",
            element: <CreatePackage />,
          },
          {
            path: "edit",
            element: <EditPackage />,
          },
        ],
      },
    ],
  },
];

client.setConfig(API_CONFIG)

const router = createBrowserRouter(routes);

export default router;