import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ("ROLE_CUSTOMER" | "ROLE_PROVIDER" | "ROLE_ADMIN")[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  requireAuth = true,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // if (requireAuth && !isAuthenticated) {
  //   // Redirect to login with return URL
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // if (roles.length > 0 && user && !roles.includes(user.role)) {
  //   // Redirect to appropriate dashboard based on user role
  //   const redirectPath =
  //     user.role === "ROLE_ADMIN"
  //       ? "/admin-dashboard"
  //       : user.role === "ROLE_PROVIDER"
  //         ? "/provider-dashboard"
  //         : "/customer-dashboard";
  //   return <Navigate to={redirectPath} replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
