import CreateUser from "../Screens/Home/User/CreateUser";
import UserList from "../Screens/Home/User/UserList";
import Inventory from "../Screens/Home/Inventory/Inventory";
import MainLayout from "../Layout/MainLayout";
import { PrivateRoute } from "./PrivateRouter";
import ListLog from "../Screens/Home/Inventory/InventoryLog";

import SlotMappingList from "../Screens/Home/Inventory/SlotMappingList";
import DistributorList from "../Screens/Home/Distributor/DistributorList";
import AssignedSlot from "../Screens/Home/Distributor/AssignedSlot";
import AssignDistributor from "../Screens/Home/Distributor/AssignDistributor";
import DistributorDashboard from "../Screens/Home/Distributor/DistributorDashboard";
import SlotManagement from "../Screens/Home/Masters/SlotManagement";
import LinesManagement from "../Screens/Home/Masters/LinesManagement";
import PriceManagement from "../Screens/Home/Masters/PriceManagement";
import ReasonManagement from "../Screens/Home/Masters/ReasonManagement";
import PlaceDirectOrder from "../Screens/Home/Orders/PlaceDirectOrder";
import Sales from "../Screens/Home/Sales/Sales";

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
          { path: "/listslotMap", element: <SlotMappingList /> },
          { path: "/listLog", element: <ListLog /> },

          { path: "/distributorList", element: <DistributorList /> },
          { path: "assignedSlots", element: <AssignedSlot /> },

          { path: "assignDistributor", element: <AssignDistributor /> },

          // Sales
           { path: "/sales", element: <Sales /> },



          // Masters

          { path: "/masters/slotManagement", element: <SlotManagement /> },
          { path: "/masters/linesManagement", element: <LinesManagement /> },
          { path: "/masters/priceManagement", element: <PriceManagement /> },
          { path: "/masters/reasonManagement", element: <ReasonManagement /> },

          // Orders

          { path:"/placeOrder",element:<PlaceDirectOrder/> }
        ],
      },

      {
        element: <PrivateRoute allowedUserTypes={[4]} />,
        children: [
          { path: "/distributorDashboard", element: <DistributorDashboard /> },
        ],
      },
    ],
  },
];
