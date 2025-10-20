// src/components/CustomerDashboard/DashboardTabs.tsx

import React from "react";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs?: string[]; // Make tabs prop explicit
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab, tabs = ["bookings", "profile", "settings"] }) => {
  // Map tab names to display labels
  const tabLabels: { [key: string]: string } = {
    bookings: "My Bookings",
    "book-service": "Book a Service", // New entry
    profile: "My Profile",
    settings: "Settings",
  };

  return (
    <div className="bg-white rounded-xl shadow p-2 flex space-x-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
            ${activeTab === tab
              ? "bg-indigo-600 text-white shadow"
              : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
            }`}
        >
          {tabLabels[tab] || tab} {/* Use label or fallback to tab name */}
        </button>
      ))}
    </div>
  );
};

export default DashboardTabs;