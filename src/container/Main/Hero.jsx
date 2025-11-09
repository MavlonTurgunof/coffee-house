import React from "react";
import coffeeVideo from "../../assets/coffeevideo.mp4";
import coffeeCup from "../../assets/icons/coffee-cup.svg";

function Hero() {
  return (
    <section className="relative h-auto w-full overflow-hidden mt-5  p-[100px]">
      <video
        className="absolute inset-0 w-full h-full object-cover rounded-[40px]"
        src={coffeeVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40 rounded-[40px]"></div>
      <div className="relative z-10 text-text2 max-w-[40%] flex flex-col gap-10 items-start">
        <h1 className=" text-[72px] font-semibold">
          <span className="text-text3  ">Enjoy</span> premium coffee at our
          charming cafe
        </h1>
        <p className="16px font-normal">
          With its inviting atmosphere and delicious coffee options, the Coffee
          House Resource is a popular destination for coffee lovers and those
          seeking a warm and inviting space to enjoy their favorite beverage.
        </p>
        <button className="text-text1 bg-bg px-[78px] py-5 rounded-[100px] flex  gap-2 group">
          <img
            src={coffeeCup}
            alt=""
            className="w-6 h-6 hidden group-hover:block transition-all duration-300"
          />
          Menu
        </button>
      </div>
    </section>
  );
}

export default Hero;
