import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/userPages/signUp";
import Manage from "./pages/userPages/manage/manage";
import CreateInstance from "./pages/userPages/createInstance";
import Support from "./pages/userPages/support";
import InstanceSetting from "./pages/userPages/manage/instanceSetting";
import Billing from "./pages/userPages/billing";

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
