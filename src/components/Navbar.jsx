import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import coffeeCup from "../assets/icons/coffee-cup.svg";
import CartIcon from "../assets/icons/shopping-bag.svg";
import Likecup_nocolor from "../assets/icons/coffeecup_nocolor.png";

function Navbar() {
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav className="text-text1 flex items-center justify-between text-[20px] font-medium">
      <Link to={"/"}>
        <img src={logo} alt="logo" className="w-[100px] h-[60px]" />
      </Link>

      <ul className="flex gap-10">
        <li
          onClick={() => scrollToSection("favorite")}
          className="relative cursor-pointer group"
        >
          Favorite coffee
          <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
        </li>

        <li
          onClick={() => scrollToSection("about")}
          className="relative cursor-pointer group"
        >
          About
          <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
        </li>

        <li
          onClick={() => scrollToSection("mobile")}
          className="relative cursor-pointer group"
        >
          Mobile app
          <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
        </li>

        <li
          onClick={() => scrollToSection("contact")}
          className="relative cursor-pointer group"
        >
          Contact us
          <div className="absolute h-px bg-text1 group-hover:w-full w-0 transition-[width] duration-300" />
        </li>
      </ul>

      <div className="flex items-center gap-4">
        <Link to={"/wishlist"}>
          <img src={Likecup_nocolor} alt="Wishlist" className="w-6 h-6" />
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
