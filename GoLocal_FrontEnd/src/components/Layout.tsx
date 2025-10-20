import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  MapPin,
  LogOut,
  Settings,
  Calendar,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
//import { Users } from "../pages/AdminDashboard";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Home" },
      { path: "/services", label: "Services" },
      { path: "/about", label: "About" },
    ];

    if (isAuthenticated && user) {
      if (user.role === "ROLE_ADMIN") {
        baseItems.push({ path: "/admin-dashboard", label: "Admin Dashboard" });
      } else if (user.role === "ROLE_PROVIDER") {
        baseItems.push({ path: "/provider-dashboard", label: "Dashboard" });
      } else {
        baseItems.push({ path: "/customer-dashboard", label: "Dashboard" });
      }
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Navigation */}
      <nav
        className={`fixed w-full top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-20 shadow-premium"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => handleNavClick("/")}
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-premium-gradient rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-glow">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gradient">
                    Go Local
                  </span>
                  <div className="text-xs text-gray-500 font-medium">
                    Premium Services
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 hover-lift ${
                    isActive(item.path)
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-gradient rounded-full"></div>
                  )}
                </button>
              ))}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                    >
                      <img
                        src={
                           user.profilePicture  //||
                          //"https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150"
                        } // customer or provider user 
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium">{user.username}</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-premium border border-gray-100 py-2 z-[200]">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-medium text-gray-900">
                            {user.username}
                          </p>
                          {/* <p className="text-sm text-gray-500">{user.email}</p> */}
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              user.role === "ROLE_ADMIN"
                                ? "bg-red-100 text-red-800"
                                : user.role === "ROLE_PROVIDER"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={() => {
                              const dashboardPath = user.role === "ROLE_ADMIN"
                                ? "/admin-dashboard"
                                : user.role === "ROLE_PROVIDER"
                                  ? "/provider-dashboard"
                                  : "/customer-dashboard";
                              handleNavClick(dashboardPath);
                              setShowUserMenu(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Dashboard</span>
                          </button>

                          <button
                            onClick={() => {
                              handleNavClick("/profile");
                              setShowUserMenu(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </button>

                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                              navigate("/");
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavClick("/login")}
                      className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 hover-lift"
                    >
                      <User className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleNavClick("/signup/customer")}
                      className="btn-premium text-white px-6 py-3 rounded-2xl font-semibold hover-lift shadow-glow"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-20 border-t border-gray-200 animate-slide-down z-[99]">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`block w-full text-left px-4 py-3 text-base font-semibold rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                      <img
                        src={
                          // user.avatar ||
                          "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150"
                        }
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-center px-4 py-3 text-red-600 border-2 border-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handleNavClick("/login")}
                      className="flex-1 text-center px-4 py-3 text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleNavClick("/signup/customer")}
                      className="flex-1 text-center btn-premium text-white px-4 py-3 rounded-xl font-semibold"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">{children}</main>

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-premium-gradient opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-premium-gradient rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Go Local</span>
                  <div className="text-xs text-gray-400">Premium Services</div>
                </div>
              </div>

              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Connecting local communities with skilled professionals. Find
                trusted services in your neighborhood and support local
                businesses with our premium platform.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
                  (social) => (
                    <button
                      key={social}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover-lift"
                    >
                      <span className="text-sm font-bold">{social[0]}</span>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Join Us */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Join Our Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <button
                    onClick={() => handleNavClick("/signup/helper")}
                    className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                  >
                    Become a Provider
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/signup/customer")}
                    className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                  >
                    Find Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("/dashboard")}
                    className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2025 Go Local. All rights reserved. Supporting local
                communities worldwide.
              </p>

              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <button
                  onClick={() => handleNavClick("/privacy")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => handleNavClick("/terms")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => handleNavClick("/support")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;