import { AuthRouter } from "./AuthRouter";
import { HomeRouter } from "./HomeRouter";
import { AuthPrivate, PublicRoute } from "./PrivateRouter";
import Unauthorized from "../Screens/Auth/Unauthorized";
import { createHashRouter, RouterProvider } from "react-router-dom";

const MainRoute = createHashRouter([
  {
    element: <AuthPrivate />,
    children: AuthRouter,
  },
  {
    element: <PublicRoute />,
    children: HomeRouter,
  },
  {
    path: "*",
    element: <Unauthorized />, 
  },
]);


 const AppRouter = () => <RouterProvider router={MainRoute} />;

export default AppRouter;


// vicky_distributor