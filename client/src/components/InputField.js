import React from "react";

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
    <div className="w-full">
      <input
        type={type || "text"}
        className="px-4 py-2 rounded-sm border w-full my-2"
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
