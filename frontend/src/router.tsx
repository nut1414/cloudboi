import { createBrowserRouter, RouteObject } from "react-router-dom"
import { lazy } from "react"
import { publicOnlyGuard, userRouteGuard, adminRouteGuard } from "./guard"
import { client } from "./client"
import { API_CONFIG } from "./config/api"
import { RouterErrorBoundary } from "./components/ErrorBoundary"

// Layouts
const DefaultLayout = lazy(() => import("./components/Layout/DefaultLayout"))
const PublicLayout = lazy(() => import("./components/Layout/PublicLayout"))
const AdminLayout = lazy(() => import("./components/Layout/AdminLayout"))

// Public pages
const App = lazy(() => import("./pages/Landing/App"))
const Login = lazy(() => import("./pages/User/Auth/Login"))
const Register = lazy(() => import("./pages/User/Auth/Register"))

// User pages
const InstanceListPage = lazy(() => import("./pages/Instance/InstanceListPage"))
const InstanceCreatePage = lazy(() => import("./pages/Instance/InstanceCreatePage"))
const InstanceSettingPage = lazy(() => import("./pages/Instance/InstanceSettingPage"))
const UserBillingPage = lazy(() => import("./pages/User/UserBillingPage"))
const Support = lazy(() => import("./pages/User/support"))

// Admin pages
const UserManagePage = lazy(() => import("./pages/Admin/UserManagePage"))
const AdminBillingPage = lazy(() => import("./pages/Admin/AdminBillingPage"))
const InstancePlanManagePage = lazy(() => import("./pages/Admin/InstancePlanManagePage"))
const SystemStatusPage = lazy(() => import("./pages/Admin/SystemStatusPage"))
/**
 * Route configuration with authentication guards
 * 
 * These guards run before the route renders and handle redirects
 * while working with our existing UserContext
 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "login",
        element: <Login />,
        loader: publicOnlyGuard,
      },
      {
        path: "register",
        element: <Register />,
        loader: publicOnlyGuard,
      },
    ],
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
        element: <div>User Setting Page</div>,
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
  {
    path: "/admin",
    element: <AdminLayout />,
    loader: adminRouteGuard,
    children: [
      {
        path: "system",
        element: <SystemStatusPage />,
      },
      {
        path: "users",
        element: <UserManagePage />,
      },
      {
        path: "plans",
        element: <InstancePlanManagePage />,
      },
      {
        path: "billing",
        element: <AdminBillingPage />,
      },
      {
        path: "credits",
        element: <div>Credits Page</div>,
      },
    ],
  },
]

client.setConfig(API_CONFIG)

const router = createBrowserRouter(routes)

export default router
