import { useState } from "react";
import { auth } from "../../firebase";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const user = auth.currentUser; // Get the logged-in user directly from Firebase

  const handleSend = () => {
    if (message.trim() && user) {
      onSendMessage({
        text: message,
        senderId: user.uid,
        senderName: user.displayName || "Anonymous",
      });
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="p-3 flex">
      <input
        type="text"
        className="flex-1 border p-2 rounded-md"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
