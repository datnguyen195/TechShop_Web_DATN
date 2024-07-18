import path from "./path";
import icons from "./icons";

const { IoIosLogOut, IoIosPeople } = icons;
export const adminSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Dashboard",
    path: `/${path.DASHBOARD}`,
    icon: <IoIosLogOut />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Manage users",
    path: `/${path.MANAGE_USERS}`,
    icon: <IoIosPeople />,
  },
  {
    id: 3,
    type: "PARENT",
    text: "Manage product",
    icon: <IoIosPeople />,
    submenu: [
      {
        text: "Create product",
        path: `/${path.CREATEP_RODUCTS}`,
      },
      {
        text: "Manage product",
        path: `/${path.MANAGE_PRODUCTS}`,
      },
    ],
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Manage orders",
    path: `/${path.MANAGE_ORDER}`,
    icon: <IoIosPeople />,
  },
];

export const roles = [
  { code: 0, title: "Admin" },
  { code: 1, title: "User" },
];
