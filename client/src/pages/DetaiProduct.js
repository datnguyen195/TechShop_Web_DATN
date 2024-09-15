import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiDeleteVarrianst, apiGetDetaiProduct } from "../apis";
import Slider from "react-slick";
import DOMPurify from "dompurify";
import clsx from "clsx";
import icons from "../ultils/icons";

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
  const { MdEditSquare, MdClose } = icons;

  const fetchProduct = async () => {
    const response = await apiGetDetaiProduct(pid);
    setDetai(response);
  };

  const handleDelete = async (_id) => {
    const response = apiDeleteVarrianst(_id, pid);
    setDetai(response);
  };

  useEffect(() => {
    fetchProduct();
  }, [pid]);

  return (
    <div className="w-[95%] mx-auto mt-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-4 lg:w-1/3">
          <img
            src={detai?.thumb}
            alt="product"
            className="w-full h-[458px] object-cover border rounded-md shadow-md"
          />
          <div className="w-full">
            <Slider {...settings}>
              {detai?.images?.map((el, index) => (
                <div key={index}>
                  <img
                    src={el}
                    alt={`product-${index}`}
                    className="w-full h-[100px] object-cover border rounded-md p-1"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="border p-6 border-red-300 lg:w-2/3 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-2">{varriant?.title}</h2>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-red-600 font-semibold">
              {`${formatMoney(formatPrice(detai?.price))} VND`}
            </h2>
            <span className="text-sm">{`In Stock: ${detai?.quantity}`}</span>
          </div>
          <div className="flex items-center mb-4 gap-2">
            {renderStarFromNumber(detai?.totalRatings)?.map((el) => (
              <span key={el}>{el}</span>
            ))}
            <span className="text-sm text-red-500">{`(Sold: ${detai?.sold})`}</span>
          </div>
          <div
            className="text-sm text-gray-600 mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(detai?.description),
            }}
          ></div>
          <div className="my-4">
            <span className="font-semibold">Variants:</span>
            <div className="w-21 flex flex-wrap gap-2 mt-2">
              {detai?.varriants?.map((el) => (
                <div
                  key={el.sku}
                  className={clsx(
                    "flex items-start gap-4 p-4 border rounded-md shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer",
                    varriant === el.sku ? "border-red-500" : "border-gray-300"
                  )}
                  onClick={() => setVarriant(el.sku)}
                >
                  <img
                    src={el.thumb}
                    alt={el.color}
                    className="w-20 h-20 rounded-md object-cover "
                  />
                  <div className="flex flex-col flex-grow">
                    <span className="text-gray-800 font-medium text-base">
                      {el.color}
                    </span>
                    <span className="text-gray-600 text-sm">${el.price}</span>
                  </div>

                  {/* Edit and Delete buttons */}
                  <div className="ml-4 flex flex-col justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents variant selection when clicking button
                        // handleEdit(el._id); // Call the edit function
                      }}
                      className="bg-blue-500 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 "
                    >
                      <MdEditSquare className="text-white text-lg" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents variant selection when clicking button
                        handleDelete(el._id); // Call the delete function
                      }}
                      className="bg-red-500  flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 "
                    >
                      <MdClose className="text-white text-lg" />
                    </button>
                  </div>
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
