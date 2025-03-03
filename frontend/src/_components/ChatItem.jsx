import { formatDistanceToNow } from "date-fns";

const ChatItem = ({ chat, onClick }) => {
  // Ensure timestamp is valid before formatting
  const formattedTime = chat.timestamp
    ? formatDistanceToNow(new Date(chat.timestamp.seconds * 1000), {
        addSuffix: true,
      }) // Convert Firestore timestamp
    : "Unknown time";

  return (
    <div
      className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-100 transition"
      onClick={onClick}
    >
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl">
        {chat.name?.charAt(0) || "?"}
      </div>
      <div className="flex-1 ml-4">
        <h2 className="text-lg font-semibold">{chat.name || "Unknown"}</h2>
        <p className="text-gray-500 text-sm truncate">
          {chat.lastMessage || "No messages yet"}
        </p>
      </div>
      <span className="text-xs text-gray-400">{formattedTime}</span>
    </div>
  );
};

export default ChatItem;
