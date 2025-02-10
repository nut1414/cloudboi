import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/signUp";
import Manage from "./pages/manage/manage";
import CreateInstance from "./pages/createInstance";
import OverViewPage from "./pages/billing/overview";
import HistoryPage from "./pages/billing/history";
import TopUpPage from "./pages/billing/top-up";
import Support from "./pages/support";
import InstanceSetting from "./pages/manage/instanceSetting";

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
    path: "/billing/overview",
    element: <OverViewPage/>
  },
  {
    path: "/billing/history",
    element: <HistoryPage/>
  },
  {
    path: "/billing/top-up",
    element: <TopUpPage/>
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
