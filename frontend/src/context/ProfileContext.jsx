import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children, userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;