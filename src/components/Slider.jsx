import React, { useContext } from "react";
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
      {/* desktop */}
      <div className="hidden md:flex  bg-[#1f1f1f] h-screen w-20 flex-col items-center justify-between text-white">
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


      {/* mobile */}
      <div className="flex md:hidden bg-[#1f1f1f] w-full h-16 fixed bottom-0 left-0 z-50 text-white items-center justify-around px-4 border-t border-gray-700">
        <button
          // onClick={() => navigate("/chat")}
          className="flex flex-col items-center gap-1 hover:text-gray-300 transition-colors"
        >
          <MessageCircle size={24} />
          <span className="text-[10px]">Chats</span>
        </button>

        <button className="flex flex-col items-center gap-1 hover:text-gray-300 transition-colors">
          <CircleDashed size={24} />
          <span className="text-[10px]">Status</span>
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-9 h-9 rounded-full border border-gray-500 overflow-hidden">
            {user?.profilePic ? (
              <img
                src={
                  user.profilePic.startsWith("http")
                    ? user.profilePic
                    : `${baseUrl}${user.profilePic}`
                }
                alt="Profile"
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-[9px]">
                No Img
              </div>
            )}
          </div>
          <span className="text-[10px]">Profile</span>
        </button>

        {/* <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 hover:text-red-400 transition-colors"
        >
          <LogOut size={24} />
          <span className="text-[10px]">Logout</span>
        </button> */}
      </div>
    </>
  );
}

export default Slider;
