import path from "./path";
import icons from "./icons";

const {
  IoIosPeople,
  MdReceiptLong,
  MdAppRegistration,
  MdOutlineTrendingUp,
  MdPerson,
  IoIosToday,
  MdOutlineCategory,
  MdComment,
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
    icon: <MdOutlineCategory />,
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
  // {
  //   id: 5,
  //   type: "PARENT",
  //   text: "Quản lý hãng",
  //   icon: <MdAppRegistration />,
  //   submenu: [
  //     {
  //       text: "Tạo hãng sản phẩm",
  //       path: `/${path.CREATEP_BRAND}`,
  //     },
  //     {
  //       text: "Quản lý hãng sản phẩm",
  //       path: `/${path.MANAGE_BRAND}`,
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   type: "PARENT",
  //   text: "Quản đơn hàng",
  //   icon: <IoIosToday />,
  //   submenu: [
  //     {
  //       text: "Quản Lý đơn",
  //       path: `/${path.MANAGE_ORDER}`,
  //     },
  //     {
  //       text: "Chờ xác nhận",
  //       path: `/${path.MANAGE_ORDER}`,
  //     },
  //   ],
  // },
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
    icon: <MdComment />,
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
  { code: 0, title: "Chờ xác nhận" },
  { code: 1, title: "Thành công" },
  { code: 2, title: "Huỷ đơn" },
];
