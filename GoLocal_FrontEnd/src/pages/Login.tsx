import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader,
  Lock,
  MapPin,
  User,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Assuming you have a custom hook for authentication
const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { login, loading, isAuthenticated, user } = useAuth(); // Destructure 'user' to get role, and 'setUser' to update the user context directly if needed.
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Correctly set 'from' to redirect to the previous page or home

  useEffect(() => {
    // If authenticated, redirect based on role or to the 'from' location
    if (isAuthenticated && user) {
      if (user.role === "ROLE_ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else if (user.role === "ROLE_PROVIDER") {
        navigate("/provider-dashboard", { replace: true });
      } else if (user.role === "ROLE_CUSTOMER") {
        navigate("/customer-dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, user]); // Add user to dependency array

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      if (activeTab === "signin") {
        // Use the login function from AuthContext
        const successLogin = await login(formData.username, formData.password);

        if (successLogin) {
          setSuccess("Login successful! Redirecting...");
          // The useEffect will handle the navigation based on the updated isAuthenticated and user state.
        } else {
          setError("Invalid username or password");
        }
      } else {
        // For demo - redirect to appropriate signup page
        // The original logic for signup tab seemed to rely on username presence for helper signup.
        // It's usually better to have explicit buttons or clearer paths for different signup types.
        // For now, keeping the original conditional navigation for signup.
        // if (formData.username) {
        //   navigate("/signup/helper");
        // } else {
        //   navigate("/signup/customer");
        // }
      }
    } catch (err) {
      console.error("Login component handleSubmit error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300 opacity-20 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-400 opacity-20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-pink-400 opacity-15 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-indigo-300 opacity-20 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-20 rounded-3xl shadow-premium p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-premium-gradient rounded-2xl flex items-center justify-center">
                <MapPin className="h-7 w-7 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === "signin" ? "Welcome Back!" : "Join Go Local"}
            </h2>
            <p className="text-gray-600">
              {activeTab === "signin"
                ? "Sign in to access your account"
                : "Create an account to get started"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === "signin"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {activeTab === "signin" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                {/* Demo Credentials */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Demo Credentials:
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Customer:</strong> customer / password123
                    </p>
                    <p>
                      <strong>Provider:</strong> provider / password123
                    </p>
                    <p>
                      <strong>Admin:</strong> admin / admin123
                    </p>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">
                Choose your account type to get started
              </p>
              <div className="space-y-3">
                <Link
                  to="/signup/customer"
                  className="block w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Sign Up as Customer
                </Link>
                <Link
                  to="/signup/provider"
                  className="block w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Sign Up as Service Provider
                </Link>
              </div>
            </div>
          )}

          {/* Alternative Actions */}
          <div className="mt-8 text-center">
            {activeTab === "signin" ? (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("signin")}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;