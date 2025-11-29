import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">

        {/* Brand */}
        <span className="navbar-brand fw-bold fs-4">
          My Tasks
        </span>

        {/* User Info + Logout */}
        <div className="d-flex align-items-center">
          <span className="text-white me-3 fw-semibold">
            {user?.name}
          </span>

          <button
            className="btn btn-light btn-sm fw-semibold px-3"
            onClick={logout}
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
