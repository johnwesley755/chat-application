import React, { useState, useEffect } from "react";
import socket from "../services/socket";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <MessageList messages={messages} />
      <ChatInput setMessages={setMessages} />
    </div>
  );
};

export default Chat;
