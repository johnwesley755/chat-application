import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const chatRef = collection(db, "users"); // Assuming users are chat contacts
      const chatSnapshot = await getDocs(chatRef);
      const chatList = chatSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    };

    fetchChats();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg mt-5">
      <h2 className="text-xl font-bold p-4 bg-green-500 text-white">Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="p-4 border-b cursor-pointer hover:bg-gray-100 flex items-center"
          >
            <img
              src={chat.photoURL || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold">{chat.name}</h3>
              <p className="text-sm text-gray-500">{chat.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
