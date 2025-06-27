
import CreateUser from "../Screens/Home/Admin/CreateUser";
import UserList from "../Screens/Home/Admin/UserList";
import Inventory from "../Screens/Home/Inventory/Inventory";
// import DistributorDashboard from "../Screens/Distributor/DistributorDashboard";
// import VendorDashboard from "../Screens/Vendor/VendorDashboard";
import MainLayout from "../Layout/MainLayout";
import { PrivateRoute } from "./PrivateRouter";
import ListLog from "../Screens/Home/Inventory/InventoryLog";
import DistributorLog from "../Screens/Home/Inventory/DistributorLog";
import SlotMappingList from "../Screens/Home/Inventory/SlotMappingList";

export const HomeRouter = [
  {
    element: <MainLayout />,
    children: [
      {
        element: <PrivateRoute allowedUserTypes={[1]} />,
        children: [
          { path: "/userManagement", element: <UserList /> },
          { path: "/createUser", element: <CreateUser /> },
          { path: "/editUser", element: <CreateUser /> },
          { path: "/inventory", element: <Inventory /> },
          {path: "/listLog", element: <ListLog /> },
          //slot mapping
          {path:"/listslotMap",element:<SlotMappingList/>},

          

          { path: "/distributorLog", element: <DistributorLog /> },
        ],
      },

      {
        element: <PrivateRoute allowedUserTypes={[2]} />,
        children: [
            //   { path: "/vendorDashboard", element: <VendorDashboard /> },
        ],
      },

      {
        element: <PrivateRoute allowedUserTypes={[3]} />,
        children: [
            //   { path: "/distributorDashboard", element: <DistributorDashboard /> },

        ],
      },
    ],
  },
];
