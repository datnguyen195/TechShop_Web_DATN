import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetDetaiProduct } from "../apis";

const DetaiProduct = () => {
  const { pid } = useParams();
  const [detai, setDetai] = useState(null);

  const fetchProduct = async () => {
    const response = await apiGetDetaiProduct(pid);
    console.log("detai", response);
    //     if (response) {
    //         setDetai(response);
    //       console.log("ratings2", response);
    //     }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return <div>DetaiProduct {pid}</div>;
};

export default DetaiProduct;
