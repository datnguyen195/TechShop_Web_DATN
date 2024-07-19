import axios from "../axios";

export const apiGetCategores = () =>
  axios({
    url: "/prodcategory/",
    method: "get",
  });

export const apiGetBrand = () =>
  axios({
    url: "/brand/",
    method: "get",
  });
export const apiCreateProduct = (data) =>
  axios({
    url: "/product/",
    method: "post",
    data,
  });

export const apiGetProducts = (params) =>
  axios({
    url: "/product/",
    method: "get",
    params,
  });
