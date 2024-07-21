import React, { useEffect, useState, memo, useCallback } from "react";
import { Button, InputFrom, MarkdownEditor, Select } from "../../components";
import { useForm } from "react-hook-form";
import { apiCreateProduct, apiGetBrand, apiGetCategores } from "../../apis";
import { getBase64, validate } from "../../ultils/helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import icons from "../../ultils/icons";
import path from "../../ultils/path";

const UpdateProducts = ({ edit, render, setEdit, onClose }) => {
  const fetchCategories = async () => {
    const response = await apiGetCategores();
    if (response.success) setCategories(response.createCategory);
  };

  const fetchBrand = async () => {
    const response = await apiGetBrand();
    if (response.success) setBrand(response.getBrand);
  };
  const [payload, setPayload] = useState({
    description: "",
  });
  const [preiew, setPreview] = useState({
    thumb: "",
    images: [],
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({});

  useEffect(() => {
    const maxEffectCount = 300; // Đổi số lần tùy ý
    if (effectCount < maxEffectCount) {
      reset({
        title: edit?.title || "",
        price: edit?.price || "",
        quantity: edit?.quantity || "",
        color: edit?.color || "",
        category: edit?.category || "",
        brand: edit?.brand || "",
      });
      setEffectCount(effectCount + 1);
    }
  }, []);

  const [hoverElm, setHoverElm] = useState(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [brand, setBrand] = useState(null);
  const [effectCount, setEffectCount] = useState(0);
  const { MdClose } = icons;

  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );
  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/webp"
      ) {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  const handlePreview = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };
  const handleDeteImg = (name) => {
    const files = [...watch("images")];
    reset({ images: files?.filter((el) => el.name !== name) });
    if (preiew.images?.some((el) => el.name === name))
      setPreview((prev) => ({
        ...prev,
        images: prev.images?.filter((el) => el.name != name),
      }));
  };
  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append("images", image);
      }
      console.log("formData", formData);
      const response = await apiCreateProduct(formData);
      if (response.success) {
        reset();
        setPayload({
          thumb: "",
          image: [],
        });
        navigate(`/${path.MANAGE_PRODUCTS}`);
      }
    }
  };
  const handleCloseModal = () => {
    setEdit(null);
  };
  useEffect(() => {
    if (watch("thumb")?.FileList?.length == 0) {
      handlePreview(watch("thumb")[0]);
    }
  }, [watch("thumb")]);

  useEffect(() => {
    if (watch("images")?.FileList?.length == "") {
      handlePreviewImages(watch("images"));
    }
  }, [watch("images")]);

  useEffect(() => {
    fetchCategories();
    fetchBrand();
    reset({
      title: edit?.title || "",
      price: edit?.price || "",
      quantity: edit?.quantity || "",
      color: edit?.color || "",
      category: edit?.category || "",
      brand: edit?.brand || "",
    });
    setPayload({
      description:
        typeof edit.description === "object"
          ? edit.description?.join(",")
          : edit.description,
    });
    setPreview({
      thumb: edit?.thumb || "",
      images: edit?.images || [],
    });
  }, [edit]);
  console.log("88", watch("images")?.FileList?.length == 0);
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-[80%] bg-gray-100 flex justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Update products</h1>
        <button
          className=" text-red-600 hover: underline cursor-pointer"
          onClick={handleCloseModal}
        >
          Trở về
        </button>
      </div>
      <div className="p-4 ">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputFrom
            label="Name product"
            register={register}
            errors={errors}
            id={"title"}
            validate={{
              required: "Cần nhập thông tin",
            }}
            placeholder="Tên sản phẩm mới"
          />
          <div className="w-full flex gap-[50px] my-8">
            <div className="flex-auto">
              <InputFrom
                label="Giá"
                register={register}
                errors={errors}
                id={"price"}
                fullwidth
                validate={{
                  required: "Cần nhập thông tin",
                }}
                style="flex-auto"
                placeholder="Giá sản phẩm mới"
                type="number"
              />
            </div>
            <div className="flex-auto">
              <InputFrom
                label="Số lương"
                register={register}
                errors={errors}
                id={"quantity"}
                fullwidth
                validate={{
                  required: "Cần nhập thông tin",
                }}
                style="flex-auto"
                placeholder="Giá sản phẩm mới"
                type="number"
              />
            </div>
            <div className="flex-auto">
              <InputFrom
                label="Màu"
                register={register}
                errors={errors}
                id={"color"}
                fullwidth
                validate={{
                  required: "Cần nhập thông tin",
                }}
                placeholder="Giá sản phẩm mới"
              />
            </div>
          </div>
          <div className="w-full flex gap-4 mt-5">
            <div className="flex-auto">
              <Select
                label="category"
                register={register}
                fullwidth
                style={"p-2 border  border-gray-950 "}
                errors={errors}
                id={"category"}
                validate={{
                  required: "Không được để trống",
                }}
                options={categories?.map((el) => ({
                  code: el.title,
                  title: el.title,
                }))}
              />
            </div>
            <div className="flex-auto">
              <Select
                label="Hãng"
                register={register}
                fullwidth
                style={"p-2 border flex-auto  border-gray-950 "}
                errors={errors}
                id={"brand"}
                validate={{
                  required: "Không được để trống",
                }}
                options={brand?.map((el) => ({
                  code: el.title,
                  title: el.title,
                }))}
              />
            </div>
          </div>

          <MarkdownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            value={payload.description}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label htmlFor="thumb">Upload ảnh</label>
            <input
              type="file"
              id="thumb "
              {...register("thumb", { required: "Thêm ảnh" })}
            />
            {errors["thumb"] && (
              <small className="text-red-600">{errors["thumb"]?.message}</small>
            )}
          </div>

          <div className="my-4">
            <img
              src={preiew.thumb}
              alt="hu"
              className="w-[200px] object-contain"
            />
          </div>

          <div className="flex flex-col gap-2 mt-8">
            <label htmlFor="products">Upload ảnh</label>
            <input
              type="file"
              id="products"
              multiple
              {...register("images", { required: "Thêm ảnh" })}
            />
            {errors["images"] && (
              <small className="text-red-600">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preiew.images.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {preiew.images?.map((el, idx) => (
                <div
                  onMouseEnter={() => setHoverElm(el.name)}
                  key={idx}
                  className="w-fit relative"
                  onMouseLeave={() => setHoverElm(null)}
                >
                  <img
                    key={idx}
                    src={el}
                    alt="Sản phẩm"
                    className="w-[200px] object-contain"
                  />
                  {hoverElm === el.name && (
                    <div
                      className=" inset-0  bg-red-50 absolute"
                      onClick={() => handleDeteImg(el.name)}
                    >
                      <MdClose size={24} color="black" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <Button type="submit" name="Thêm sản phẩm" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProducts);
