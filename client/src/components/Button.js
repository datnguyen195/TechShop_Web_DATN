import React, { memo } from "react";

const Button = ({
  name,
  handleOnClink,
  style,
  iconBefore,
  inconAfter,
  fw,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={
        style
          ? style
          : `px-4, py-2 rounded-md text-white my-2 bg-main p-2 ${
              fw ? "w-full" : "w-fit"
            }`
      }
      onClick={() => {
        handleOnClink && handleOnClink();
      }}
    >
      {iconBefore}
      <span>{name}</span>
      {inconAfter}
    </button>
  );
};

export default memo(Button);
