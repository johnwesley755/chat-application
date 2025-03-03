import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const ChatPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchMessages = () => {
      const chatRef = collection(db, `chats/${id}/messages`);
      const q = query(chatRef, orderBy("timestamp", "asc"));
      return onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
    };

    fetchUser();
    const unsubscribe = fetchMessages();

    return () => unsubscribe();
  }, [id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!auth.currentUser) {
      console.error("User not authenticated.");
      return;
    }

    try {
      await addDoc(collection(db, `chats/${id}/messages`), {
        text: newMessage,
        senderId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-green-500 p-4 text-white text-lg flex items-center">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            className="w-8 h-8 rounded-full mr-3"
            alt="User"
          />
        )}
        {user?.name || "User"}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${
              msg.senderId === auth.currentUser?.uid
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs md:max-w-sm lg:max-w-md ${
                msg.senderId === auth.currentUser?.uid
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-300 text-black mr-auto"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t flex">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 bg-green-500 text-white p-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
