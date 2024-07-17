import React, { useEffect, useState } from "react";

const useDebounce = (value, ms) => {
  const [debValue, setDebValue] = useState("");
  useEffect(() => {
    const setTimeOutId = setTimeout(() => {
      setDebValue(value);
    }, ms);
    return () => {
      clearTimeout(setTimeOutId);
    };
  }, [value, ms]);
  return debValue;
};

export default useDebounce;
