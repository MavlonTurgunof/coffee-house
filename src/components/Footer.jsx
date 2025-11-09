import React from "react";
import facebook from "../assets/icons/facebook.svg";
import instagram from "../assets/icons/insta.svg";
import twitter from "../assets/icons/twitter.svg";
import pin from "../assets/icons/pin-alt.svg";
import phone from "../assets/icons/phone.svg";
import clock from "../assets/icons/clock.svg";

function Footer() {
  return (
    <footer className="bg-secondary rounded-10 flex items-center gap-[100px] p-[100px] font-semibold rounded-[40px] text-text2">
      <div className="max-w-[530px]">
        <h1 className=" text-[60px] pb-10">
          Sip, Savor, Smile.
          <span className="text-text3"> It’s coffee time!</span>
        </h1>
        <div className="flex items-center gap-3">
          <img src={facebook} alt="facebook" className="h-12 w-12" />
          <img src={instagram} alt="instagram" className="h-12 w-12" />
          <img src={twitter} alt="twitter" className="h-12 w-12" />
        </div>
      </div>
      <div>
        <h1 className="pb-8 text-[24px]">Contact Us</h1>
        <div className="text-[16px] flex flex-col gap-5">
          <p className="flex items-center gap-2">
            <img src={pin} alt="" className="h-5 w-5" />
            8558 Green Rd., LA
          </p>
          <p className="flex items-center gap-2">
            <img src={phone} alt="" className="h-5 w-5" /> +1 (603) 555-0123
          </p>
          <p className="flex items-center gap-2">
            <img src={clock} alt="" className="h-5 w-5" /> Mon-Sat: 9:00 AM –
            23:00 PM
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
