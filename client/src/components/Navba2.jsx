import React from "react";
import { assets } from "../assets/assets";
import { SignUp } from "@clerk/clerk-react";

const Navba2 = () => {
  return (
    <div className="container p-4 flex items-center m-auto  gap-5 justify-between ">
      <img src={assets.logo} alt="" />

      <div className="flex gap-4 ">
        <button>SignIn</button>
        <button>SignUp</button>
      </div>
    </div>
  );
};

export default Navba2;
