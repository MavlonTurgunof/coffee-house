import React from "react";
import logo from "../assets/logo.svg";
import coffeeCup from "../assets/icons/coffee-cup.svg";
import CartIcon from "../assets/icons/shopping-bag.svg";
import Likecup_nocolor from "../assets/icons/coffeecup_nocolor.png";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="text-text1 flex items-center justify-between text-[20px] font-medium">
      <div>
        <img src={logo} alt="logo" className="w-[100px] h-[60px]" />
      </div>
      <ul className="flex gap-10 ">
        <li className="relative cursor-pointer group">
          Favorite coffee{" "}
          <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
        </li>
        <li className="relative cursor-pointer group">
          About
          <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
        </li>
        <li className="relative cursor-pointer group">
          Mobile app
          <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
        </li>
        <li className="relative cursor-pointer group">
          Contact us
          <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <Link to={"/wishlist"}>
          <img src={Likecup_nocolor} alt="Cart" className="w-6 h-6" />
        </Link>
        <Link to={"/cart"}>
          <img src={CartIcon} alt="Cart" className="w-6 h-6" />
        </Link>
        <Link to={"/menu"} className="flex items-center gap-2">
          <h2 className="relative cursor-pointer group">
            Menu
            <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
          </h2>
          <img src={coffeeCup} alt="coffee cup" className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
