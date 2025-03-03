import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

// 🔹 Firebase Config (Use environment variables for security)
const firebaseConfig = {
  apiKey: "AIzaSyBaeSm6hKSgW9kWAMklIkckDjaV2qfcsCQ",
  authDomain: "chat-app-b3195.firebaseapp.com",
  projectId: "chat-app-b3195",
  storageBucket: "chat-app-b3195.firebasestorage.app",
  messagingSenderId: "131935337591",
  appId: "1:131935337591:web:c49f95deeee80b19fd1a72",
  measurementId: "G-SLZS8GP4XE",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/**
 * 🔹 Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await createUserProfile(user); // Save user data to Firestore
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

/**
 * 🔹 Sign Out User
 */
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
};

/**
 * 🔹 Create or Update User Profile in Firestore
 */
export const createUserProfile = async (user) => {
  if (!user) return;
  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        photoURL: user.photoURL || "",
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

/**
 * 🔹 Listen to Auth State Changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

/**
 * 🔹 Real-time Listener for User Profile
 */
export const listenToUserProfile = (userId, callback) => {
  if (!userId) return;
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

// 🔹 Export instances
export { auth, db, provider, signOut };
