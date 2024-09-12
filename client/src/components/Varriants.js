import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputFrom from "./InputFrom";
import Button from "./Button";
import { getBase64 } from "../ultils/helper";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { apiAddVarrianst } from "../apis/app";
import path from "../ultils/path";

const Varriants = ({ varriant, render, setVarriant }) => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({});
  const handleCloseModal = () => {
    setVarriant(null);
  };
  const [preiew, setPreview] = useState({
    thumb: "",
    images: [],
  });

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/webp"
      ) {
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push(base64);
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  const handlePreview = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handleAddVarriant = async (data) => {
    if (data.color === varriant.color) {
      Swal.fire("Oops!", "Color not changed", "info");
    } else {
      const formData = new FormData();
      for (let i of Object.entries(data)) formData.append(i[0], i[1]);
      if (data.thumb) formData.append("thumb", data.thumb[0]);
      if (data.images) {
        for (let image of data.images) formData.append("images", image);
      }
      const response = await apiAddVarrianst(formData, varriant._id);
      console.log("response", response);
      if (response.status) {
        Swal.fire("Thành công.", response.mes, "success");
        reset();
        setPreview({
          thumb: "",
          image: [],
        });
        handleCloseModal();
      }
    }
  };
  useEffect(() => {
    reset({
      title: varriant?.title,
      color: varriant?.color,
      price: varriant?.price,
      type: varriant?.type,
    });
  }, [varriant]);
  console.log(varriant);
  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0) {
      handlePreview(watch("thumb")[0]);
    }
  }, [watch("thumb")]);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0) {
      handlePreviewImages(watch("images"));
    }
  }, [watch("images")]);
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-[80%] bg-gray-100 flex justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Varriants products
        </h1>
        <button
          className=" text-red-600 hover: underline cursor-pointer"
          onClick={handleCloseModal}
        >
          Trở về
        </button>
      </div>
      <form
        className="p-4 w-full flex flex-col gap-4"
        onSubmit={handleSubmit(handleAddVarriant)}
      >
        <div className="flex w-full gap-4 items-center">
          <InputFrom
            label="Tên sản phẩm"
            register={register}
            errors={errors}
            id={"title"}
            fullwidth
            validate={{
              required: "Cần nhập thông tin",
            }}
            placeholder="Tem sản phẩm"
          />
        </div>
        <div className="flex w-full gap-4 items-center">
          <InputFrom
            label="Giá"
            register={register}
            errors={errors}
            id={"price"}
            fullwidth
            validate={{
              required: "Cần nhập thông tin",
            }}
            placeholder="Giá sản phẩm "
            type="number"
          />

          <InputFrom
            label="Biến thể"
            register={register}
            errors={errors}
            id={"color"}
            fullwidth
            validate={{
              required: "Cần nhập thông tin",
            }}
            placeholder="Biến thể sản phẩm "
          />
          <InputFrom
            label="Số lương"
            register={register}
            errors={errors}
            id={"quantity"}
            fullwidth
            validate={{
              required: "Cần nhập thông tin",
            }}
            placeholder="Số lượng"
          />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          <label htmlFor="thumb">Ảnh bìa</label>
          <input
            type="file"
            id="thumb "
            {...register("thumb", { required: "Thêm ảnh" })}
          />
          {errors["thumb"] && (
            <small className="text-red-600">{errors["thumb"]?.message}</small>
          )}
        </div>
        {preiew.thumb && (
          <div className="my-4">
            <img
              src={preiew.thumb}
              alt="hu"
              className="w-[200px] object-contain"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 mt-8">
          <label htmlFor="products">Ảnh sản phẩm</label>
          <input
            type="file"
            id="products"
            multiple
            {...register("images", { required: "Thêm ảnh" })}
          />
          {errors["images"] && (
            <small className="text-red-600">{errors["images"]?.message}</small>
          )}
        </div>

        <div className="my-4 flex w-full gap-3 flex-wrap">
          {preiew.images?.map((el, idx) => (
            <div key={idx} className="w-fit relative">
              <img
                key={idx}
                src={el}
                alt="Sản phẩm"
                className="w-[200px] object-contain"
              />
            </div>
          ))}
        </div>

        <div className="mt-3">
          <Button type="submit" name="Thêm biến thể" />
        </div>
      </form>
    </div>
  );
};

export default memo(Varriants);
