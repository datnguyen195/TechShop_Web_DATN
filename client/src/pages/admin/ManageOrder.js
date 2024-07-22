import React, { useCallback, useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/app";
import moment from "moment";
import icons from "../../ultils/icons";
import useDebounce from "../../components/useDebounce";
import InputFrom from "../../components/InputFrom";
import Pagination from "../../components/Pagination";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import UpdateProducts from "./UpdateProducts";
const { MdDelete, MdEditSquare, MdOutlineClear, MdSystemUpdateAlt } = icons;

const ManageOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [products, setProducts] = useState(null);
  const [counts, setCounts] = useState(null);
  const [edit, setEdit] = useState(null);
  const [update, setUpdate] = useState(null);
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
  }, [params, update]);
  console.log("tu", setEdit);

  return (
    <div className="w-full flex-col gap-4 relative">
      {edit && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50 ">
          <UpdateProducts edit={edit} render={render} setEdit={setEdit} />
        </div>
      )}

      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Manage Oder</span>
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
              <th className="text-center py-2">Hãng</th>
              <th className="text-center py-2">Loại</th>
              <th className="text-center py-2">Giá</th>
              <th className="text-center py-2">Số lượng</th>
              <th className="text-center py-2">Đã bán</th>
              <th className="text-center py-2">Màu</th>
              <th className="text-center py-2">Đánh giá</th>
              <th className="text-center py-2">Ngày bán</th>
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
                <td className="text-center py-2">{el.brand}</td>
                <td className="text-center py-2">{el.category}</td>
                <td className="text-center py-2">{el.price}</td>
                <td className="text-center py-2">{el.quantity}</td>
                <td className="text-center py-2">{el.sold}</td>
                <td className="text-center py-2">{el.color}</td>
                <td className="text-center py-2">{el.ratings.length}</td>
                <td className="text-center py-2">
                  {moment(el.createdAt).format("DD / MM / YYYY")}
                </td>
                <td className="px-2 py-2 flex-row gap-2"></td>
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

export default ManageOrder;
