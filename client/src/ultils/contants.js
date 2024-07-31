import path from "./path";
import icons from "./icons";

const {
  IoIosLogOut,
  IoIosPeople,
  MdReceiptLong,
  MdAppRegistration,
  MdOutlineTrendingUp,
  MdPerson,
  IoIosToday,
} = icons;
export const adminSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Thống kê",
    path: `/${path.DASHBOARD}`,
    icon: <MdOutlineTrendingUp />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Quản lý người dùng",
    path: `/${path.MANAGE_USERS}`,
    icon: <IoIosPeople />,
  },
  {
    id: 3,
    type: "PARENT",
    text: "Quản lý sản phẩm",
    icon: <MdAppRegistration />,
    submenu: [
      {
        text: "Tạo sản phẩm",
        path: `/${path.CREATEP_RODUCTS}`,
      },
      {
        text: "Quản lý sản phẩm",
        path: `/${path.MANAGE_PRODUCTS}`,
      },
    ],
  },

  {
    id: 4,
    type: "PARENT",
    text: "Quản lý loại",
    icon: <MdAppRegistration />,
    submenu: [
      {
        text: "Tạo loại sản phẩm",
        path: `/${path.CREATEP_CATEGORI}`,
      },
      {
        text: "Quản lý loại sản phẩm",
        path: `/${path.MANAGE_CATEGORI}`,
      },
    ],
  },
  {
    id: 5,
    type: "PARENT",
    text: "Quản lý hãng",
    icon: <MdAppRegistration />,
    submenu: [
      {
        text: "Tạo hãng sản phẩm",
        path: `/${path.CREATEP_BRAND}`,
      },
      {
        text: "Quản lý hãng sản phẩm",
        path: `/${path.MANAGE_BRAND}`,
      },
    ],
  },
  {
    id: 6,
    type: "SINGLE",
    text: "Quản đơn hàng",
    path: `/${path.MANAGE_ORDER}`,
    icon: <IoIosToday />,
  },
  {
    id: 7,
    type: "SINGLE",
    text: "Quản bình luận",
    path: `/${path.MANAGE_RATINGS}`,
    icon: <IoIosToday />,
  },
  {
    id: 8,
    type: "SINGLE",
    text: "Tài khoản",
    path: `/${path.PRO_FILE}`,
    icon: <MdPerson />,
  },
];

export const roles = [
  { code: 0, title: "Admin" },
  { code: 1, title: "User" },
];

export const statusOrder = [
  { label: "Cancelled", value: "Cancelled" },
  { label: "Succeed", value: "Succeed" },
];
