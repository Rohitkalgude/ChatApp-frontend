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
            {user?.profilePic ? (
              <img
                src={
                  user.profilePic.startsWith("http")
                    ? user.profilePic
                    : `${baseUrl}${user.profilePic}`
                }
                alt="Profile"
                onClick={() => navigate("/profile")}
                className="w-full h-full object-cover shadow-sm hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-sm">
                No Img
              </div>
            )}
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
