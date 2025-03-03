import { auth, signOut } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl font-semibold">Chat App</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
