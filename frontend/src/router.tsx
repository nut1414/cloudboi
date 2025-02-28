import { createBrowserRouter } from "react-router-dom";
import App from "./pages/Landing/App";
import SignUp from "./pages/Auth/signUp";
import Manage from "./pages/InstanceList/manage";
import CreateInstance from "./pages/InstanceCreate/createInstance";
import Billing from "./pages/Billing/billing";
import Setting from "./pages/InstanceSetting/setting";
import Support from "./pages/User/support";

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

]);

export default router;
