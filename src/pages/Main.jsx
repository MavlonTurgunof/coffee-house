import React, { useEffect } from "react";
import Hero from "../container/Main/Hero";
import { useLocation } from "react-router-dom";
import About from "../container/Main/About";

function Main() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  return (
    <>
      <Hero />
      <About />
    </>
  );
}

export default Main;
