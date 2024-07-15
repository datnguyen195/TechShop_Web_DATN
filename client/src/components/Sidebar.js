import React, { Fragment, memo, useState } from "react";
import logo from "../assets/1.jpg";
import { NavLink } from "react-router-dom";
import { adminSidebar } from "../ultils/contants";
import clsx from "clsx";
import icons from "../ultils/icons";
const { FaAngleDown, FaCaretLeft } = icons;

const activedStyle = "px-4 py-2 flex items-center gap-2 bg-blue-200";
const NotActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-blue-100";

const Sidebar = () => {
  const [actived, setActived] = useState([]);
  const handleShowTap = (tapId) => {
    if (actived.some((el) => el === tapId))
      setActived((pr) => pr.filter((el) => el !== tapId));
    else setActived((pr) => [...pr, tapId]);
  };
  return (
    <div className="py-4 bg-blue-100 h-full">
      <div className="flex flex-col justify-center items-center py-4 gap-2">
        <img src={logo} alt="logo" className="w-[200px] object-contain" />
        <small>Quản lý</small>
      </div>
      <div>
        {adminSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({ isActive }) =>
                  clsx(isActive && activedStyle, !isActive && NotActivedStyle)
                }
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}
            {el.type === "PARENT" && (
              <div
                className="flex flex-col"
                onClick={() => handleShowTap(el.id)}
              >
                <div className="flex items-center justify-between gap-2 px-4 py-2">
                  <div className="flex items-center gap-2 ">
                    <span>{el.icon}</span>
                    <span>{el.text}</span>
                  </div>
                  {actived.some((id) => id === el.id) ? (
                    <FaCaretLeft />
                  ) : (
                    <FaAngleDown />
                  )}
                </div>
                {actived.some((id) => id === el.id) && (
                  <div className="flex flex-col ">
                    {el.submenu.map((item) => (
                      <NavLink
                        key={el.text}
                        to={item.path}
                        className={({ isActive }) =>
                          clsx(
                            isActive && activedStyle,
                            !isActive && NotActivedStyle,
                            "pl-6"
                          )
                        }
                      >
                        {item.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(Sidebar);
