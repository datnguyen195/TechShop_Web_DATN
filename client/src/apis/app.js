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
    url: "/product/w",
    method: "get",
    params,
  });

export const apiUpdateProducts = (data, pid) =>
  axios({
    url: "/product/" + pid,
    method: "put",
    data,
  });

export const apiDeleteProducts = (pid) =>
  axios({
    url: "/product/" + pid,
    method: "delete",
  });

export const apiGetOrder = (params) =>
  axios({
    url: "/order/admin",
    method: "get",
  });
