import React from "react";
import { sendReward } from "../lib/sendReward";
interface ProductData {
  title: string;
  product_overview: {
    [key: string]: string;
  };
  about_this_item: string;
  product_info: string;
  product_info_2: {
    [key: string]: string;
  };
  product_description: string;
  witb_section: string[];
  img_src: string;
}

interface ProductDataProps {
  data: ProductData;
  widthClass: string;
}
function isRunningAsExtension() {
  return (
    typeof window.chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined"
  );
}
const ProductData = ({ data, widthClass }: ProductDataProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <img
          src={data?.img_src}
          alt={data?.title}
          className={`${widthClass} mb-2`}
        />
        <p
          style={{ cursor: "pointer" }}
          className="text-right font-bold font-sans text-lg w-40"
          onClick={() => {
            if (isRunningAsExtension()) {
              window.open("http://localhost:5173", "_blank");
            } else {
              sendReward();
            }
          }}
        >
          {data?.title.slice(0, 20)}...
        </p>
      </div>
    </>
  );
};

export default ProductData;
