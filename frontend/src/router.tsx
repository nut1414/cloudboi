import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/signUp";
import Manage from "./pages/manage";
import CreateInstance from "./pages/createInstance";
import Billing from "./pages/billing";
import AccessPage from "./pages/setting/access";
import GraphsPage from "./pages/setting/graphs";
import PowersPage from "./pages/setting/powers";
import NetworkingPage from "./pages/setting/networking";
import DestroyPage from "./pages/setting/destroy";
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
    path: "/setting/access",
    element: <AccessPage/>
  },
  {
    path: "/setting/graphs",
    element: <GraphsPage/>
  },
  {
    path: "/setting/powers",
    element: <PowersPage/>
  },
  {
    path: "/setting/networking",
    element: <NetworkingPage/>
  },
  {
    path: "/setting/destroy",
    element: <DestroyPage/>
  },
  {
    path: "/support",
    element: <Support/>
  },

]);

export default router;
