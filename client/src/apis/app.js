import axios from "../axios";

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

export const apiCreateBrand = (data) =>
  axios({
    url: "/brand/",
    method: "post",
    data,
  });
export const apiGetBrand = () =>
  axios({
    url: "/brand/",
    method: "get",
  });

export const apiUpdateBrand = (data, pid) =>
  axios({
    url: "/brand/" + pid,
    method: "put",
    data,
  });

export const apiDeleteBrand = (bid) =>
  axios({
    url: "/brand/" + bid,
    method: "delete",
  });

export const apiCreateCategores = (data) =>
  axios({
    url: "/prodcategory/",
    method: "post",
    data,
  });

export const apiGetCategores = () =>
  axios({
    url: "/prodcategory/",
    method: "get",
  });

export const apiUpdateCategores = (data, pid) =>
  axios({
    url: "/prodcategory/" + pid,
    method: "put",
    data,
  });

export const apiDeleteCategores = (bid) =>
  axios({
    url: "/prodcategory/" + bid,
    method: "delete",
  });

export const apiGetRatings = () =>
  axios({
    url: "/product/ratings",
    method: "get",
  });

export const apiGetDetaiProduct = (pid) =>
  axios({
    url: "/product/detai/" + pid,
    method: "get",
  });

export const apiDeleteRating = (rid, pid) =>
  axios({
    url: "/product/removrating/" + rid,
    method: "delete",
    data: { pid },
  });

export const apiAddVarrianst = (data, pid) =>
  axios({
    url: "/product/varriants/" + pid,
    method: "put",
    data,
  });
