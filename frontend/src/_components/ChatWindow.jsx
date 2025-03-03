const ChatWindow = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
        <div key={index} className="mb-2 p-2 bg-blue-100 rounded">
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
