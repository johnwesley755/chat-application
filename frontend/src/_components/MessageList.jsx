import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="border p-4 h-64 overflow-y-auto">
      {messages.map((msg, index) => (
        <div key={index} className="p-2 border-b">
          <strong>{msg.name}: </strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
