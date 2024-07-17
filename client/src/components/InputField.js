import React, { useState } from "react";
import clsx from "clsx";

const InputField = ({
  value,
  setValue,
  namekey,
  type,
  invalidFields,
  setInvalidFields,
  fw,
  fullWidth,
  placeholder,
  title,
}) => {
  return (
    <div className={clsx("w-full relative flex-col", fullWidth && "w-full")}>
      {!title && value.trim() !== "" ? (
        <label
          className="text-[10px] absolute top-0 left-4 block bg-white px-1"
          htmlFor="nameKey"
        >
          {namekey?.slice(0, 1).toUpperCase() + namekey?.slice(1)}
        </label>
      ) : null}
      <input
        type={type || "text"}
        className={clsx(
          "px-4 py-2 rounded-sm border w-full my-2 outline-none",
          fw
        )}
        placeholder={
          placeholder || namekey?.slice(0, 1).toUpperCase() + namekey?.slice(1)
        }
        value={value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, [namekey]: e.target.value }))
        }
      />
      {invalidFields?.some((el) => el.name === namekey) && (
        <small className="text-main">
          {invalidFields.find((el) => el.name === namekey)?.mes}
        </small>
      )}
    </div>
  );
};

export default InputField;
