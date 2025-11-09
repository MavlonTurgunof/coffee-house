import React from "react";
import Logo from "../../assets/logo.svg";
import Likecup_color from "../../assets/icons/coffeecup_color.png";
import Likecup_nocolor from "../../assets/icons/coffeecup_nocolor.png";

function ProductCard({ product, Image, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="cursor-pointer rounded-[40px] border border-bordermenu overflow-hidden flex flex-col"
    >
      <div className="relative">
        <img
          src={Image || Logo}
          alt={product?.name}
          className="object-contain rounded-[40px]"
        />
        <div className="flex items-center justify-center absolute h-15 w-15 bg-bg rounded-full top-2.5 right-2.5">
          <img src={Likecup_nocolor} alt="cup" className="w-9 h-9" />
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h1 className="text-[24px] font-semibold">{product?.name}</h1>
          <p className="text-[16px] font-normal mt-2">{product?.description}</p>
        </div>

        <p className="text-[24px] font-semibold mt-4">${product?.price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
