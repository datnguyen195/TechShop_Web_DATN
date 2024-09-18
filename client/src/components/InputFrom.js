import React, { memo } from "react";
import clsx from "clsx";
const InputForm = ({
  label,
  disabled,
  register,
  errors,
  id,
  validate,
  type = "text",
  placeholder,
  fullwidth,
  style,
  readOnly,
  layout,
  defaulfValue,
}) => {
  return (
    <div className={clsx("flex flex-col w-full  h-[65px] gap-2", layout)}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          " p-2 border border-black my-auto",
          fullwidth && "w-full",
          style
        )}
        defaultValue={defaulfValue}
        readOnly={readOnly}
      />

      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};
export default memo(InputForm);
