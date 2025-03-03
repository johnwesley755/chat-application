import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import ChatItem from "../_components/ChatItem";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [newChatEmail, setNewChatEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("users", "array-contains", user.email));
      const querySnapshot = await getDocs(q);

      const chatList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    };

    fetchChats();
  }, []);

  const handleNewChat = async () => {
    if (!newChatEmail) return;

    const user = auth.currentUser;
    if (newChatEmail === user.email) {
      alert("You can't chat with yourself!");
      return;
    }

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("users", "array-contains-any", [user.email, newChatEmail])
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingChat = querySnapshot.docs[0];
      navigate(`/chat/${existingChat.id}`);
      return;
    }

    const newChatRef = await addDoc(chatsRef, {
      users: [user.email, newChatEmail],
      lastMessage: "",
      timestamp: new Date(),
    });

    navigate(`/chat/${newChatRef.id}`);
    setNewChatEmail("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <div className="mb-4 flex">
        <input
          type="email"
          placeholder="Enter email to start chat"
          value={newChatEmail}
          onChange={(e) => setNewChatEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleNewChat}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Chat
        </button>
      </div>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          onClick={() => navigate(`/chat/${chat.id}`)}
        />
      ))}
    </div>
  );
};

export default Home;
