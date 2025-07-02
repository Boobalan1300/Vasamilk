
import CreateUser from "../Screens/Home/User/CreateUser";
import UserList from "../Screens/Home/User/UserList";
import Inventory from "../Screens/Home/Inventory/Inventory";
// import DistributorDashboard from "../Screens/Distributor/DistributorDashboard";
// import VendorDashboard from "../Screens/Vendor/VendorDashboard";
import MainLayout from "../Layout/MainLayout";
import { PrivateRoute } from "./PrivateRouter";
import ListLog from "../Screens/Home/Inventory/InventoryLog";

import SlotMappingList from "../Screens/Home/Inventory/SlotMappingList";
import DistributorList from "../Screens/Home/Distributor/DistributorList";
import AssignedSlot from "../Screens/Home/Distributor/AssignedSlot";
import AssignDistributor from "../Screens/Home/Distributor/AssignDistributor";

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
           {path:"/listslotMap",element:<SlotMappingList/>},
          {path: "/listLog", element: <ListLog /> },
            
          {path:"/distributorList",element:<DistributorList/>},
           {path:"assignedSlots",element:<AssignedSlot/>},

           {path:"assignDistributor",element:<AssignDistributor/>},
         
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
