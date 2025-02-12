import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/signUp";
import Manage from "./pages/manage/manage";
import CreateInstance from "./pages/createInstance";
import Support from "./pages/support";
import InstanceSetting from "./pages/manage/instanceSetting";
import Billing from "./pages/billing";

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
    path: "/Instance", 
    element: <Manage />, 
  },
  {
    path: "/manage/Createinstance",
    element: <CreateInstance/>
  },
  {
    path: "/Billing",
    element: <Billing/>
  },
  {
    path: "/support",
    element: <Support/>
  },
  {
    path: "/instance/:instance_id",
    element: <InstanceSetting/>
  },
 

]);

export default router;
