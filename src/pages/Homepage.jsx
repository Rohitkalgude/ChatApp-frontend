import React, { useState } from "react";
import Chatcontainer from "../components/Chatcontainer.jsx";
import Slider from "../components/Slider.jsx";
import Message from "../components/Message.jsx";

function Homepage() {
  const [selectdUser, setSelectdUser] = useState(null);

  const handleSelectUser = (user) => {
    setSelectdUser(user);
  };

  const handleBack = () => {
    setSelectdUser(null);
  };

  return (
    <>
      <div className="flex h-screen w-screen bg-[#111] overflow-hidden">
        <div className="hidden md:flex">
          <Slider />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div
            className={`
            bg-[#2d2d2d] border-r border-gray-900 shadow-xl shadow-black/40
            flex flex-col
            ${
              selectdUser
                ? "hidden md:flex md:w-[28%] md:min-w-[300px]"
                : "flex w-full md:w-[28%] md:min-w-[300px]"
            }
          `}
          >
            <Chatcontainer onSelectUser={handleSelectUser} />
          </div>
          <div
            className={`
            flex-1 bg-[#1f1f1f] flex flex-col
            ${selectdUser ? "flex" : "hidden md:flex"}
          `}
          >
            {selectdUser ? (
              <Message user={selectdUser} onBack={handleBack} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a user to start chatting 💬
              </div>
            )}
          </div>
        </div>

        {!selectdUser && (
          <div className="flex md:hidden fixed bottom-0 left-0 w-full z-50">
            <Slider />
          </div>
        )}
      </div>
    </>
  );
}

export default Homepage;
