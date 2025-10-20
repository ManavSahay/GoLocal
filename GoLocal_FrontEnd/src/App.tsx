import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FilterProvider } from "./contexts/FilterContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import About from "./pages/About";
import Login from "./pages/Login";
import SearchResults from "./pages/SearchResults";
import ServiceProvider from "./pages/ServiceProvider";
import SignupCustomer from "./pages/SignupCustomer";


// Dashboards
import CustomerDashboard from "./pages/CustomerDashboard";
// import ProviderDashboard from "./pages/ProviderDashboard";
import  ProviderDashboard  from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Legacy Dashboard (for backward compatibility)
import Dashboard from "./pages/Dashboard";
import SignupProvider from "./pages/SignupProvider";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import BookServiceForm from "./components/CustomerDashboard/BookServiceForm";

function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route index element={<Home />} />
              <Route path="/services" element={<ServicePage />} />
              <Route path="/services/:username" element={<ServiceDetailPage />} />
              <Route path="/book-service/:username" element={<BookServiceForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup/customer" element={<SignupCustomer />} />
              <Route path="/signup/provider" element={<SignupProvider />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/provider/:id" element={<ServiceProvider />} />

              {/* Protected Routes - Customer */}
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute roles={["ROLE_CUSTOMER"]}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Provider */}
              <Route
                path="/provider-dashboard"
                element={
                  <ProtectedRoute roles={["ROLE_PROVIDER"]}>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute roles={["ROLE_ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Legacy Dashboard Route - Redirects based on user role */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Generic Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          Profile Settings
                        </h1>
                        <p className="text-gray-600">
                          Profile page coming soon...
                        </p>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        404
                      </h1>
                      <p className="text-gray-600 mb-8">Page not found</p>
                      <a
                        href="/"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </FilterProvider>
    </AuthProvider>
  );
}

export default App;
