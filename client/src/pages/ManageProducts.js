import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteProducts, apiGetProducts } from "../apis/app";
import moment from "moment";
import icons from "../ultils/icons";
import useDebounce from "../components/useDebounce";
import InputFrom from "../components/InputFrom";
import Pagination from "../components/Pagination";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Swal from "sweetalert2";
import { useForm, SubmitHandler } from "react-hook-form";
import UpdateProducts from "./UpdateProducts";
import { Varriants } from "../components";
const { MdDelete, MdEditSquare, MdRemoveRedEye, MdDashboardCustomize } = icons;

const ManageProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [products, setProducts] = useState(null);
  const [counts, setCounts] = useState(null);
  const [edit, setEdit] = useState(null);
  const [update, setUpdate] = useState(null);
  const [varriant, setVarriant] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({});

  const handleSearch = (data) => {
    console.log(data);
  };
  const render = () => {
    setUpdate(!update);
  };
  const fetchProducts = async (parmas) => {
    const response = await apiGetProducts({ ...parmas, limit: 10 });
    if (response.success) {
      setProducts(response.products);
      setCounts(response.counts);
    }
  };

  const queryDebounce = useDebounce(watch("q"), 800);

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure remove this product",
      icon: "warning",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteProducts(pid);
        if (response.success)
          Swal.fire({
            icon: "success",
            title: "Xử lý thành công.",
            showConfirmButton: false,
            timer: 1000,
          });
        else {
          Swal.fire({
            icon: "error",
            title: "Xảy ra lỗi.",
            showConfirmButton: false,
            timer: 1000,
          });
        }
        render();
      }
    });
  };

  useEffect(() => {
    if (queryDebounce) {
      navigate({
        path: location.pathname,
        search: createSearchParams({ q: queryDebounce }).toString(),
      });
    } else
      navigate({
        pathname: location.pathname,
      });
  }, [queryDebounce]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProducts(searchParams);
    console.log("searchParams", searchParams);
  }, [params, update]);

  return (
    <div className="w-full flex-col gap-4 relative">
      {edit && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50 ">
          <UpdateProducts edit={edit} render={render} setEdit={setEdit} />
        </div>
      )}
      {varriant && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50 ">
          <Varriants
            varriant={varriant}
            render={render}
            setVarriant={setVarriant}
          />
        </div>
      )}

      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Quản lý sản phẩm</span>
      </h1>
      <div className="w-full py-4 px-4">
        <form className="w-[45%]" onSu={handleSubmit(handleSearch)}>
          <InputFrom
            id="q"
            register={register}
            errors={errors}
            fullwidth
            placeholder="Tìm kiếm sản phẩm"
          />
        </form>
        <table className="table-auto mb-6 text-left w-full ">
          <thead className="font-bold bg-gray-500 text-[13px] text-white">
            <tr>
              <th className="text-center py-2">STT</th>
              <th className="text-center py-2">Ảnh</th>
              <th className="text-center py-2">Tên</th>

              <th className="text-center py-2">Loại</th>
              <th className="text-center py-2">Giá</th>
              <th className="text-center py-2">Số lượng</th>
              <th className="text-center py-2">Đã bán</th>
              <th className="text-center py-2">Biến thể</th>
              <th className="text-center py-2">Đánh giá</th>
              <th className="text-center py-2">Ngày tạo</th>
              <th className="text-center py-2">Sửa </th>
            </tr>
          </thead>

          <tbody>
            {products?.map((el, idx) => (
              <tr className="border-b " key={el._id}>
                <td className="text-center py-2">{idx + 1}</td>
                <td className="text-center py-2">
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className="w-12 h-12 object-cover"
                  />
                </td>
                <td className="text-center py-2">{el.title}</td>
                <td className="text-center py-2">{el.category}</td>
                <td className="text-center py-2">{el.price}</td>
                <td className="text-center py-2">{el.quantity}</td>
                <td className="text-center py-2">{el.sold}</td>
                <td className="text-center py-2">{el.varriants.length}</td>
                <td className="text-center py-2">{el.ratings.length}</td>

                <td className="text-center py-2">
                  {moment(el.createdAt).format("DD / MM / YYYY")}
                </td>
                <td className="py-4 flex justify-center items-center gap-2">
                  <MdRemoveRedEye
                    size={24}
                    color="red"
                    onClick={() => {
                      navigate(`/detai/${el._id}`);
                    }}
                  />
                  <MdEditSquare
                    size={24}
                    color="red"
                    onClick={() => {
                      setEdit(el);
                    }}
                  />

                  <MdDelete
                    size={24}
                    color="red"
                    onClick={() => {
                      handleDeleteProduct(el._id);
                    }}
                  />

                  <MdDashboardCustomize
                    size={24}
                    color="red"
                    onClick={() => {
                      setVarriant(el);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-full flex justify-b">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
