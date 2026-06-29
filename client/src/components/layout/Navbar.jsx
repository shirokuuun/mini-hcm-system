import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { logoutUser } from "../../services/firebase/authService.js";

const Navbar = () => {
  const { userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-500 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-bold text-lg">Mini HCM</span>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-gray-700 text-white"
                : "text-black/80 hover:text-white hover:bg-gray-500"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/attendance"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/attendance")
                ? "bg-gray-700 text-white"
                : "text-black/80 hover:text-white hover:bg-gray-500"
            }`}
          >
            Attendance
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/admin")
                    ? "bg-gray-700 text-white"
                    : "text-black/80 hover:text-white hover:bg-gray-500"
                }`}
              >
                Admin
              </Link>
              <Link
                to="/admin/reports"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/admin/reports")
                    ? "bg-gray-700 text-white"
                    : "text-black/80 hover:text-white hover:bg-gray-500"
                }`}
              >
                Reports
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-black/80 text-sm font-medium">
              {userProfile?.name}
            </p>
            <p className="text-gray-500 text-xs capitalize">
              {userProfile?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
