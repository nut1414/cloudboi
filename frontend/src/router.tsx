import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/signUp";
import Manage from "./pages/manage";
import CreateInstance from "./pages/createInstance";
import Billing from "./pages/billing";
import Setting from "./pages/setting";
import Support from "./pages/support";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Signup", 
    element: <SignUp />,  
  },
  {
    path: "/manage", 
    element: <Manage />, 
  },
  {
    path: "/manage/Createinstance",
    element: <CreateInstance/>
  },
  {
    path: "/billing",
    element: <Billing/>
  },
  {
    path: "/setting",
    element: <Setting/>
  },
  {
    path: "/support",
    element: <Support/>
  },

]);

export default router;
