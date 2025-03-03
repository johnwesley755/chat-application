import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const PrivateChat = ({ user, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "privateMessages"),
      where("receiverId", "==", receiverId),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "privateMessages"), {
      text: newMessage,
      createdAt: new Date(),
      uid: user.uid,
      receiverId,
    });
    setNewMessage("");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg">Private Chat</h2>
      <div className="h-64 overflow-y-auto border p-2">
        {messages.map((msg) => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Send
      </button>
    </div>
  );
};

export default PrivateChat;
