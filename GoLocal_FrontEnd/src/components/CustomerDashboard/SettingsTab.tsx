import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, ShieldOff } from "lucide-react";

const SettingsTab: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleClearData = () => {
    localStorage.clear();
    alert("Local data cleared.");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-1">Session</h3>
          <p className="text-sm text-gray-500 mb-2">
            Securely sign out from your current session.
          </p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-1">Clear Local Data</h3>
          <p className="text-sm text-gray-500 mb-2">
            Remove saved tokens or cache from this device.
          </p>
          <button
            onClick={handleClearData}
            className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            <ShieldOff className="h-4 w-4" />
            Clear Data
          </button>
        </div>

        {/* Future feature: Account deletion */}
        {/* <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-1">Delete Account</h3>
          <p className="text-sm text-gray-500 mb-2">
            Permanently remove your account from Go Local. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            <Trash className="h-4 w-4" />
            Delete My Account
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SettingsTab;
