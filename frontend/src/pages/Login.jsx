import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(formData);
      login(res.user, res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        
        {/* LEFT SIDE - BACKGROUND IMAGE */}
        <div
          className="col-md-6 d-none d-md-block"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* RIGHT SIDE - FORM */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
          <div
            className="shadow-sm p-4 rounded-4"
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "#FFFFFF",
              border: "1px solid #E6E9EF",
            }}
          >
            <h2
              className="text-center mb-2 fw-bold"
              style={{ color: "#333" }}
            >
              Welcome Back
            </h2>

            <p className="text-center mb-4" style={{ color: "#777" }}>
              Login to continue
            </p>

            {error && (
              <div className="alert alert-danger text-center py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#444" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control p-3"
                  name="email"
                  placeholder="Enter your email"
                  style={{
                    borderRadius: "12px",
                    borderColor: "#D5D9E2",
                  }}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#444" }}>
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control p-3"
                    name="password"
                    placeholder="Enter your password"
                    style={{
                      borderRadius: "12px",
                      borderColor: "#D5D9E2",
                    }}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "19px",
                      color: "#666",
                    }}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </span>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn w-100 py-3 fw-bold mt-2"
                style={{
                  background: "#4A90E2",
                  color: "#fff",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Signup Link */}
              <p className="text-center mt-3" style={{ color: "#555" }}>
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="fw-bold"
                  style={{ color: "#4A90E2" }}
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
