import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/axios";
import { FiCpu, FiSearch, FiBell } from 'react-icons/fi';

function Navbar() {
  const { user, setUser, loading } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/v1/users/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow sticky top-0 z-1000">
      <Link to="/" className="text-2xl font-bold text-red-500">
        VideoHub
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        {user ? (
          <>
            <Link
              to="/ai-assistant"
              className="flex items-center gap-2 bg-linear-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
            >
              <FiCpu className="text-lg" />
              <span>AI Assistant</span>
            </Link>
            <Link to="/upload">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                Upload
              </button>
            </Link>

            <img
              src={
                user?.user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.user?.fullName}`
              }
              alt="profile"
              onClick={() => {
                console.log("CLICK USER:", user);

                if (!user?.user?.username) {
                  console.warn("User not ready yet");
                  return;
                }

                navigate(`/c/${user.user.username}`);
              }}
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-105 transition duration-200"
            />

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              className="bg-red-500 text-white px-4 py-2 rounded-full"
              to="/"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
