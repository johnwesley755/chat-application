import { auth } from "../../firebase";

const Message = ({ message }) => {
  const isSentByCurrentUser = message.senderId === auth.currentUser?.uid;

  return (
    <div
      className={`flex ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`p-3 rounded-lg max-w-xs text-white ${
          isSentByCurrentUser ? "bg-blue-500" : "bg-gray-400"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span className="text-xs opacity-75 block mt-1">
          {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default Message;
