import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Send,
  Plus,
  Info,
  MoreVertical,
  Copy,
  Trash2,
  File,
  Music,
  Video,
  Download,
  Smile,
  ArrowLeft,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import Timeformate from "../config/Timeformate";

import BgImage from "../assets/bg.jpg";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";
// import toast from "react-hot-toast";

function Message({ user, onBack }) {
  const [isOpen, setisOpen] = useState(false);
  const [text, setText] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { socket, baseUrl } = useContext(AuthContext);
  const { messages, sendMessage, getMessage, deleteMessage, typingUsers } =
    useContext(ChatContext);

  const scrollRef = useRef();
  const typingTimeoutRef = useRef();
  const emojiPickerRef = useRef();
  const optionsMenuRef = useRef();

  const { onlineUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) getMessage(user._id);
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = () => {
    if (!user || !socket) return;

    socket.emit("typing", { to: user._id });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { to: user._id });
    }, 1000);
  };

  const isTyping = typingUsers.includes(user?._id);

  const handleSend = (image = null) => {
    if (!text.trim() && !image) return;
    sendMessage(user._id, text, image);
    setText("");
    setShowEmojiPicker(false);
    socket.emit("stopTyping", { to: user._id });
  };

  const onEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    handleSend(file);
    e.target.value = "";
  };

  const handleDelete = (messageId) => {
    deleteMessage(messageId);
  };

  useEffect(() => {
    const close = () => setSelectedMsg(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Close Emoji Picker
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      // Close Message Options Menu
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setSelectedMsg(null);
      }
    };

    if (showEmojiPicker || selectedMsg) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showEmojiPicker, selectedMsg]);

  const chatMedia = messages.filter((msg) => msg.media).slice(-12);

  return (
    <div className="flex flex-col w-full h-full">
      <div
        onClick={() => setisOpen(true)}
        className="px-4 h-[76px] bg-[#262626] border-b border-[#333] flex items-center justify-between text-white"
      >
        <div className="flex items-center gap-4 cursor-pointer">
          <button
            onClick={onBack}
            className="md:hidden text-white hover:text-gray-300 transition-colors shrink-0 p-1 -ml-1"
          >
            <ArrowLeft size={22} />
          </button>

          <img
            src={
              user?.profilePic?.startsWith("http")
                ? user.profilePic
                : `${baseUrl}${user.profilePic}`
            }
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">
              {user?.fullName || "Chat"}
            </h1>
            {onlineUser.includes(user?._id) ? (
              <span
                className={`text-xs ${
                  isTyping ? "text-yellow-400" : "text-green-400"
                }`}
              >
                {isTyping ? "Typing..." : "Online"}
              </span>
            ) : (
              <span className="text-neutral-400 text-xs">Offline</span>
            )}
          </div>
        </div>

        <div className="p-2 rounded-full hover:bg-gray-700 cursor-pointer transition">
          <Info className="w-5 h-5 text-white" />
        </div>
      </div>

      {isOpen && (
        <div className="fixed top-0 right-0 w-full md:w-[350px]  h-full bg-[#1c1c1c] text-white shadow-xl border-l border-gray-700 animate-slideLeft z-50">
          <div className="flex justify-between items-center px-4 h-[76px] border-b border-gray-600">
            <button
              onClick={() => setisOpen(false)}
              className="md:hidden text-gray-400 hover:text-white transition-colors p-1 -ml-1"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-xl font-semibold absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              Contact info
            </h1>
            <button
              onClick={() => setisOpen(false)}
              className="text-xl hidden md:flex"
            >
              ✖
            </button>
          </div>

          <div className="flex flex-col items-center p-4">
            <img
              src={
                user?.profilePic
                  ? user.profilePic.startsWith("http")
                    ? user.profilePic
                    : `${baseUrl}${user.profilePic}`
                  : BgImage
              }
              alt={user?.fullName}
              className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-gray-700"
            />

            <h3 className="text-lg font-bold mt-3">{user?.fullName}</h3>
          </div>

          <div className="p-4">
            <h4 className="text-md text-gray-300">About</h4>
            <p className="text-white mt-1 text-sm">
              {user?.bio || "Hey there! I am using this chat app."}
            </p>
          </div>

          <div className="p-4">
            <h4 className="text-md text-gray-300 mb-3">
              Media, links and docs
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {chatMedia.map((msg, i) => (
                <div
                  key={i}
                  className="relative group overflow-hidden rounded-lg"
                >
                  <div
                    className="w-full h-20 bg-[#2a2a2a] flex items-center justify-center cursor-pointer hover:bg-[#333] transition-colors overflow-hidden"
                    onClick={() =>
                      window.open(
                        msg.media.url.startsWith("http")
                          ? msg.media.url
                          : `${baseUrl}${msg.media.url}`,
                        "_blank",
                      )
                    }
                  >
                    {msg.media.type === "image" ? (
                      <img
                        src={
                          msg.media.url.startsWith("http")
                            ? msg.media.url
                            : `${baseUrl}${msg.media.url}`
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : msg.media.type === "video" ? (
                      <video
                        src={
                          msg.media.url.startsWith("http")
                            ? msg.media.url
                            : `${baseUrl}${msg.media.url}`
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        muted
                        preload="metadata"
                      />
                    ) : msg.media.type === "audio" ? (
                      <div className="flex flex-col items-center gap-1">
                        <Music size={24} className="text-green-400" />
                        <span className="text-[10px] text-gray-400 px-1 truncate w-full text-center">
                          {msg.media.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <File size={24} className="text-yellow-400" />
                        <span className="text-[10px] text-gray-400 px-1 truncate w-full text-center">
                          {msg.media.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatMedia.length === 0 && (
                <p className="text-xs text-gray-500 col-span-3 text-center">
                  No media shared yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden bg-[#1d1d1d]">
        <img
          src={BgImage}
          className="absolute inset-0 w-full h-full opacity-5 object-cover pointer-events-none"
        />

        <div className="absolute inset-0 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 custom-scrollbar">
          <div className="relative space-y-4 sm:space-y-5">
            {messages.map((msg, i) => (
              <div
                key={msg._id || i}
                ref={i === messages.length - 1 ? scrollRef : null}
                className={`flex items-end gap-2 ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`relative w-fit max-w-[85%] sm:max-w-[75%] p-2 px-3 rounded-2xl text-xs sm:text-sm shadow mt-2 flex flex-col gap-1 ${
                    msg.sender === "me"
                      ? "bg-green-600 text-white rounded-br-none ml-auto"
                      : "bg-[#2d2d2d] text-gray-200 rounded-bl-none mr-auto"
                  } group`}
                >
                  {msg.media?.url && (
                    <div className="w-full max-w-[220px] sm:max-w-[300px] rounded-lg overflow-hidden mb-1">
                      {msg.media.type === "image" && (
                        <img
                          src={
                            msg.media.url.startsWith("http")
                              ? msg.media.url
                              : `${baseUrl}${msg.media.url}`
                          }
                          alt="message"
                          className="w-full h-auto object-cover cursor-pointer"
                          onClick={() =>
                            window.open(
                              msg.media.url.startsWith("http")
                                ? msg.media.url
                                : `${baseUrl}${msg.media.url}`,
                              "_blank",
                            )
                          }
                        />
                      )}

                      {msg.media.type === "video" && (
                        <video
                          src={
                            msg.media.url.startsWith("http")
                              ? msg.media.url
                              : `${baseUrl}${msg.media.url}`
                          }
                          controls
                          className="w-full h-auto"
                        />
                      )}

                      {msg.media.type === "audio" && (
                        <audio
                          src={
                            msg.media.url.startsWith("http")
                              ? msg.media.url
                              : `${baseUrl}${msg.media.url}`
                          }
                          controls
                          className="w-full"
                        />
                      )}

                      {msg.media.type === "file" && (
                        <a
                          href={
                            msg.media.url.startsWith("http")
                              ? msg.media.url
                              : `${baseUrl}${msg.media.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-[#1a1a1a] rounded-lg border border-gray-700 hover:bg-[#252525] transition-colors text-inherit"
                        >
                          <div className="p-2 bg-[#333] rounded-md shrink-0">
                            <File size={18} className="text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">
                              {msg.media.name || "File"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              Download
                            </p>
                          </div>
                          <Download
                            size={16}
                            className="text-gray-400 shrink-0"
                          />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col min-w-[60px] sm:min-w-[80px]">
                    {msg.text && (
                      <p className="whitespace-pre-wrap leading-relaxed pr-1 sm:pr-2">
                        {msg.text}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-1 self-end mt-1">
                      <span className="text-[9px] sm:text-[10px] opacity-70">
                        {Timeformate(msg.createdAt)}
                      </span>
                      {msg.sender === "me" && (
                        <span className="text-[10px] sm:text-xs">
                          {msg.seen ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMsg(
                          selectedMsg === msg._id ? null : msg._id,
                        );
                      }}
                      className="text-white/50 hover:text-white p-1 rounded-full bg-black/20 hover:bg-black/40"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  {selectedMsg === msg._id && (
                    <div
                      ref={optionsMenuRef}
                      className="absolute min-w-[110px] sm:min-w-[120px] bg-[#2a2a2a] text-white rounded-lg shadow-lg border border-gray-700 z-50 overflow-hidden"
                      style={{
                        top: "30px",
                        right: msg.sender === "me" ? "0px" : "auto",
                        left: msg.sender === "other" ? "0px" : "auto",
                      }}
                    >
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-600"
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          setSelectedMsg(null);
                        }}
                      >
                        <Copy size={14} /> Copy
                      </button>

                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-600"
                        onClick={() => {
                          handleDelete(msg._id);
                          setSelectedMsg(null);
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-2 md:p-4 bg-[#262626] border-t border-[#333] flex items-center gap-2 md:gap-3 shrink-0">
        <label className="p-2 rounded-full hover:bg-gray-700 cursor-pointer shrink-0">
          <Plus className="text-gray-300 hover:text-white" size={20} />
          <input type="file" onChange={handleImage} className="hidden" />
        </label>

        <div className="relative w-full flex items-center">
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-14 left-0 z-50"
            >
              <EmojiPicker
                theme="dark"
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
                width={window.innerWidth < 768 ? window.innerWidth - 20 : 350}
                height={window.innerWidth < 768 ? 380 : 450}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute left-3 text-gray-400 hover:text-yellow-400 transition-colors z-10"
          >
            <Smile size={20} />
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message"
            className="w-full py-2.5 md:py-3 pl-10 md:pl-12 pr-3 rounded-xl bg-[#333] text-white outline-none focus:ring-1 focus:ring-green-500 text-sm md:text-base"
          />
        </div>

        <button
          onClick={() => handleSend()}
          className="w-9 h-9 md:w-10 md:h-10 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 text-black shrink-0 flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default Message;
