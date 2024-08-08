import React, { useEffect, useState } from "react";
import { Button, InputFrom } from "../components";
import { useForm } from "react-hook-form";
import { apiCreateCategores } from "../apis";
import { getBase64 } from "../ultils/helper";
import { useNavigate } from "react-router-dom";
import icons from "../ultils/icons";

const CreateCategori = () => {
  const navigate = useNavigate();

  const [preiew, setPreview] = useState({
    image: "",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({});
  const [payload, setPayload] = useState({
    description: "",
  });

  const handleCreateProduct = async (data) => {
    const formData = new FormData();
    if (data.image.length > 0) formData.append("image", data.image[0]);
    delete data.image;
    console.log(data);
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);
    const response = await apiCreateCategores(formData);
    if (response.success) {
      reset();

      setPayload({
        image: "",
      });
    }
  };

  const handlePreview = async (file) => {
    const base64Image = await getBase64(file);
    setPreview((prev) => ({ ...prev, image: base64Image }));
  };

  useEffect(() => {
    if (watch("image")) {
      handlePreview(watch("image")[0]);
    }
  }, [watch("image")]);

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Quản lý sản phẩm</span>
      </h1>
      <div className="p-4 ">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputFrom
            label="Tên loại sản phẩm"
            register={register}
            errors={errors}
            id={"title"}
            validate={{
              required: "Cần nhập thông tin",
            }}
            placeholder="Tên sản phẩm mới"
          />

          <div className="flex flex-col gap-2 mt-8">
            <label htmlFor="image">Ảnh</label>
            <input
              type="file"
              id="image "
              {...register("image", { required: "Thêm ảnh" })}
            />
            {errors["image"] && (
              <small className="text-red-600">{errors["image"]?.message}</small>
            )}
          </div>
          {preiew.image && (
            <div className="my-4">
              <img
                src={preiew.image}
                alt="hu"
                className="w-[200px] object-contain"
              />
            </div>
          )}

          <div className="mt-3">
            <Button type="submit" name="Thêm loại sản phẩm" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateCategori;
