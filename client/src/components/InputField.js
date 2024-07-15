import React, { useState } from "react";

const InputField = ({
  value,
  setValue,
  namekey,
  type,
  invalidFields,
  setInvalidFields,
  fw,
}) => {
  return (
    <div className="w-full relative">
      {value.trim() !== "" ? (
        <label
          className="text-[10px] absolute top-0 left-4 block bg-white px-1"
          htmlFor="nameKey"
        >
          {namekey?.slice(0, 1).toUpperCase() + namekey?.slice(1)}
        </label>
      ) : null}
      <input
        type={type || "text"}
        className="px-4 py-2 rounded-sm border w-full my-2 outline-none"
        placeholder={namekey?.slice(0, 1).toUpperCase() + namekey?.slice(1)}
        value={value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, [namekey]: e.target.value }))
        }
      />
    </div>
  );
};

export default InputField;
