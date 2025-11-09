import React from "react";
import about1 from "../../assets/images/about-1.svg";
import about2 from "../../assets/images/about-2.svg";
import about3 from "../../assets/images/about-3.svg";
import about4 from "../../assets/images/about-4.svg";

export default function AboutSection() {
  return (
    <section id="about" className="mb-[100px]">
      <h1 className="text-text1">
        Resource is{" "}
        <span className="text-text3">the perfect and cozy place</span> where you
        can enjoy a variety of hot beverages, relax, catch up with friends, or
        get some work done.
      </h1>

      <div className="about-grid">
        <div className="grid-item tall">
          <img src={about1} alt="Cozy coffee scene 1" />
        </div>
        <div className="grid-item short">
          <img src={about3} alt="Cozy coffee scene 2" />
        </div>
        <div className="grid-item tall">
          <img src={about4} alt="Cozy coffee scene 3" />
        </div>
        <div className="grid-item short">
          <img src={about2} alt="Cozy coffee scene 4" />
        </div>
      </div>
    </section>
  );
}
