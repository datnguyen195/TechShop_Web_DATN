import React, { memo } from "react";

const Button = ({ name, handleOnClink, style, iconBefore, inconAfter, fw }) => {
  return (
    <button
      type="button"
      className={
        style
          ? style
          : `ps-4, py-2 rounded-md text-white bg-main ${
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
