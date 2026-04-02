import React, { useState, useEffect, useContext } from "react";
import { MessageCircle, CircleDashed, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function Slider() {
  const navigate = useNavigate();

  const { logoutUser, baseUrl, user } = useContext(AuthContext);

  const handleLogout = async (e) => {
    e.preventDefault();

    await logoutUser();
    navigate("/login");
  };

  return (
    <>
      <div className="bg-[#1f1f1f] h-screen w-20 flex flex-col items-center justify-between text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full border border-gray-500 mt-3 overflow-hidden cursor-pointer">
            <img
              src={
                user?.profilePic
                  ? user.profilePic.startsWith("http")
                    ? user.profilePic
                    : `${baseUrl}${user.profilePic.replace(/^\/+/, "")}`
                  : "https://avatar.iran.liara.run/public/boy?username=" + (user?.fullName || "User")
              }
              alt="Profile"
              onError={(e) => e.target.src = "https://avatar.iran.liara.run/public/boy?username=" + (user?.fullName || "User")}
              onClick={() => navigate("/profile")}
              className="w-full h-full object-cover shadow-sm hover:opacity-80 transition-opacity"
            />
          </div>

          <div className="mt-8 gap-6 items-center flex flex-col">
            <MessageCircle className="w-7 h-7" size={22} />
            <CircleDashed className="w-7 h-7" size={22} />
          </div>
        </div>

        <div className="mt-auto mb-5 flex flex-col items-center gap-1 cursor-pointer">
          <span>
            <LogOut onClick={handleLogout} className="w-7 h-7" size={20} />
          </span>
        </div>
      </div>
    </>
  );
}

export default Slider;
