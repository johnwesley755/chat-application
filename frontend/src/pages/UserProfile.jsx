import { useEffect, useState } from "react";
import { auth, listenToUserProfile } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Fetch user profile from Firestore
        const unsubscribeProfile = listenToUserProfile(
          currentUser.uid,
          (data) => {
            setProfile(data);
            setLoading(false);
          }
        );
        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {loading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : profile ? (
        <>
          <div className="flex items-center space-x-4">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xl">👤</span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {profile.name || "No Name"}
              </h2>
              <p className="text-gray-600">{profile.email || "No Email"}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-red-500">No profile found.</p>
      )}
    </div>
  );
};

export default Profile;
