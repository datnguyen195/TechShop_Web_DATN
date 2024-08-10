import React from "react";
import { formatMoney, renderStarFromNumber } from "../ultils/helper";
const ItemProduct = ({ productData }) => {
  console.log("productData", productData);
  return (
    <div className="w-full text-base px-[10px] mt-2 rounded-3xl">
      <div className="w-full border p-[10px] gap-6  flex flex-row bg-slate-100 rounded-2xl">
        <img
          src="https://peticon.edu.vn/wp-content/uploads/2023/10/meo_ragdoll2.jpeg"
          alt="logo"
          className="w-[80px] h-[50px] object-contain"
        />
        <div className="w-full gap-10">
          <div className=" flex flex-row justify-between">
            <div>{productData.title}</div>
            <div>
              {"x"}
              {productData.quantity}
            </div>
          </div>
          <div className=" flex flex-row justify-between">
            <div>{productData.color}</div>
            <div>
              {productData.price}
              {" VND"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemProduct;
