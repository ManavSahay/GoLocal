import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard", { replace: true });
          break;
        case "provider":
          navigate("/provider-dashboard", { replace: true });
          break;
        case "customer":
          navigate("/customer-dashboard", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default Dashboard;
