import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const DashboardHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.username || "Customer"}!
        </h2>
        <p className="text-gray-600">Here’s what’s happening with your account today.</p>
      </div>
      <img
        src={user?.profilePicture || "/default-user.png"}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
      />
    </div>
  );
};

export default DashboardHeader;
