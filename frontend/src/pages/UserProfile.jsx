import { useEffect, useState } from "react";
import { auth, listenToUserProfile } from "../../firebase";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const user = auth.currentUser; // Get user directly from Firebase

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToUserProfile(user.uid, setProfile);
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {profile ? (
        <>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p>Email: {profile.email}</p>
          {profile.photoURL && (
            <img
              src={profile.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full mt-3"
            />
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
