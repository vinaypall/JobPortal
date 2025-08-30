import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center py-3 gap-4 mt-20">
      <img src={assets.logo} alt="" />
      <p className="flex-1 border-gray-400 pl-4 text-sm text-gray-500 hidden sm:block">
        Copyright @Alpha 2023 | All Rights Reserved.
      </p>
      <div className="flex gap-4">
        <img width={38} src={assets.facebook_icon} alt="" />
        <img width={38} src={assets.instagram_icon} alt="" />
        <img width={38} src={assets.twitter_icon} alt="" />
      </div>
    </div>
  );
};

export default Footer;
