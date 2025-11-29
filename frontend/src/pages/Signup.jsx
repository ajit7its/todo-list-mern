import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login, setLoading, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all the fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const res = await signupUser(formData);
      login(res.user, res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        
        {/* LEFT SIDE IMAGE */}
        <div
          className="col-md-6 d-none d-md-block"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* RIGHT SIDE FORM */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
          <div
            className="shadow-sm p-4 rounded-4"
            style={{
              width: "100%",
              maxWidth: "450px",
              background: "#FFFFFF",
              border: "1px solid #E6E9EF",
            }}
          >
            <h2
              className="text-center mb-2 fw-bold"
              style={{ color: "#333" }}
            >
              Create Your Account
            </h2>

            <p className="text-center mb-4" style={{ color: "#777" }}>
              Start managing your tasks effortlessly
            </p>

            {error && (
              <div className="alert alert-danger text-center py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#444" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control p-3"
                  placeholder="Enter your full name"
                  style={{
                    borderRadius: "12px",
                    borderColor: "#D5D9E2",
                  }}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#444" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control p-3"
                  placeholder="Enter your email"
                  style={{
                    borderRadius: "12px",
                    borderColor: "#D5D9E2",
                  }}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#444" }}>
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control p-3"
                    placeholder="Create a password"
                    style={{
                      borderRadius: "12px",
                      borderColor: "#D5D9E2",
                    }}
                    name="password"
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

              {/* SIGNUP BUTTON */}
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
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              {/* LOGIN LINK */}
              <p className="text-center mt-3" style={{ color: "#555" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="fw-bold"
                  style={{ color: "#4A90E2" }}
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
