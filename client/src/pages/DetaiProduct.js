import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetDetaiProduct } from "../apis";
import Slider from "react-slick";
import DOMPurify from "dompurify";
import clsx from "clsx";

import {
  formatMoney,
  formatPrice,
  renderStarFromNumber,
} from "../ultils/helper";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const DetaiProduct = () => {
  const { pid } = useParams();
  const [varriant, setVarriant] = useState(null);
  const [detai, setDetai] = useState(null);

  const fetchProduct = async () => {
    const response = await apiGetDetaiProduct(pid);
    setDetai(response);
  };

  useEffect(() => {
    fetchProduct();
  }, [pid]);

  return (
    <div className="w-[90%]">
      <div className="w-[95%] m-auto mt-4 flex ">
        <div className="flex flex-col gap-4 w-3/5">
          <img
            src={detai?.thumb}
            alt="product"
            className="h-[458px] w-[458px] border object-cover"
          />
          <div className="w-[470px]">
            <Slider {...settings}>
              {detai?.images?.map((el, index) => (
                <div key={index}>
                  <img
                    src={el}
                    alt={`product-${index}`}
                    className="h-[100px] w-[90px] border object-cover p-1"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="border p-4 border-red-300 w-3/5">
          <h2 className="text-[30px] font-semibold">{varriant?.title}</h2>
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] text-red-600 font-semibold">
              {`${formatMoney(formatPrice(detai?.price))} VND`}
            </h2>
            <span className="text-sm">{`kho: ${detai?.quantity}`}</span>
          </div>

          <div className="flex items-center mt-4 gap-2">
            {renderStarFromNumber(detai?.totalRatings)?.map((el) => (
              <span key={el}>{el}</span>
            ))}
            <span className="text-sm text-red-500">{`(Đã bán: ${detai?.sold})`}</span>
          </div>

          <ul className="list-square text-smtext-gray-500 ">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(detai?.description),
              }}
            ></div>
          </ul>
          <div className="my-4 flex gap-4">
            <span>Color:</span>
            <div className="flex flex-wrap gap-4 items-center w-full">
              <div
                onClick={() => setVarriant(null)}
                className={clsx(
                  "flex items-center gap-2 p-2 border cursor-pointer",
                  !varriant && "border-red-500"
                )}
              >
                <img
                  src={detai?.thumb}
                  alt="thumb"
                  className="w-8 h-8 rounded-md object-cover"
                />
                <span className="flex flex-col">
                  <span>{detai?.color}</span>
                  <span>{detai?.price}</span>
                </span>
              </div>
              {detai?.varriants?.map((el) => (
                <div
                  onClick={() => setVarriant(el.sku)}
                  className={clsx(
                    "flex items-center gap-2 p-2 border cursor-pointer",
                    varriant === el.sku && "border-red-500"
                  )}
                >
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <span className="flex flex-col">
                    <span>{el.color}</span>
                    <span>{el.price}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[100px] w-full"></div>
    </div>
  );
};

export default DetaiProduct;
