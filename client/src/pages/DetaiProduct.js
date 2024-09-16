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
import { Varriants } from "../components"; // Import the Varriants component

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
  const [editVar, setEditVar] = useState(null);
  const [detai, setDetai] = useState(null);
  const { MdEditSquare, MdClose } = icons;

  const fetchProduct = async () => {
    const response = await apiGetDetaiProduct(pid);
    setDetai(response);
  };

  const handleEdit = async (_id) => {
    const response = await apiDeleteVarrianst(_id, pid);
    if (response) {
      setDetai(response.response);
    }
  };

  const handleDelete = async (_id) => {
    const response = await apiDeleteVarrianst(_id, pid);
    if (response) {
      setDetai(response.response);
    }
  };

  const handleAddVariant = async () => {
    // const response = await apiAddVariant(pid, newVariant);
    // if (response) {
    //   setDetai(response.response); // Update product details after adding the variant
    //   setShowAddVariantModal(true); // Show the variant modal
    // }
  };

  useEffect(() => {
    fetchProduct();
  }, [pid]);

  return (
    <div className="container mx-auto mt-8 relative">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images and Slider */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          <img
            src={detai?.thumb}
            alt="product"
            className="w-full h-[400px] object-cover border rounded-md shadow-md"
          />
          <Slider {...settings}>
            {detai?.images?.map((el, index) => (
              <div key={index}>
                <img
                  src={el}
                  alt={`product-${index}`}
                  className="w-full h-[100px] object-cover border rounded-md"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Product Details */}
        <div className="border p-6 lg:w-2/3 rounded-md shadow-md bg-white">
          <h2 className="text-3xl font-semibold mb-4">{detai?.title}</h2>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-red-600 font-semibold">
              {`${formatMoney(formatPrice(detai?.price))} VND`}
            </h2>
            <span className="text-sm text-gray-700">{`Số lượng: ${detai?.quantity}`}</span>
          </div>

          {/* Ratings and Sold */}
          <div className="flex items-center mb-4 gap-2">
            {renderStarFromNumber(detai?.totalRatings)?.map((el) => (
              <span key={el}>{el}</span>
            ))}
            <span className="text-sm text-red-500">{`(Đã bán: ${detai?.sold})`}</span>
          </div>

          {/* Product Description */}
          <div
            className="text-sm text-gray-600 mb-6"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(detai?.description),
            }}
          ></div>

          {/* Variants Section */}
          <div className="mb-6">
            <span className="font-semibold">Biến thể:</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {detai?.varriants?.map((el) => (
                <div
                  key={el.sku}
                  className={clsx(
                    "flex items-center gap-4 p-4 border rounded-md shadow-sm transition-transform hover:scale-105 cursor-pointer",
                    varriant === el.sku ? "border-red-500" : "border-gray-300"
                  )}
                  onClick={() => setVarriant(el.sku)}
                >
                  <img
                    src={el.thumb}
                    alt={el.color}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">{el.color}</p>
                    <p className="text-sm text-gray-600">{`${formatMoney(
                      el.price
                    )} VND`}</p>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(el._id);
                      }}
                      className="bg-blue-500 p-2 rounded-md text-white"
                    >
                      <MdEditSquare />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(el._id);
                      }}
                      className="bg-red-500 p-2 rounded-md text-white"
                    >
                      <MdClose />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Variant Button */}
          <button
            onClick={() => setEditVar(detai)}
            className="bg-green-500 text-white px-6 py-2 rounded-md"
          >
            Thêm Biến Thể
          </button>
        </div>
      </div>

      {/* Add Variant Modal */}
      {editVar && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50 ">
          <Varriants varriant={editVar} setVarriant={setEditVar} />
        </div>
      )}
    </div>
  );
};

export default DetaiProduct;
