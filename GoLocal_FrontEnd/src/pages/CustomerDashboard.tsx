// src/views/CustomerDashboard.tsx

import React, { useState } from "react";
import DashboardHeader from "../components/CustomerDashboard/DashboardHeader";
import DashboardTabs from "../components/CustomerDashboard/DashboardTabs";
import BookingList from "../components/CustomerDashboard/BookingList";
import ProfileTab from "../components/CustomerDashboard/ProfileTab";
import SettingsTab from "../components/CustomerDashboard/SettingsTab";
import BookServiceForm from "../components/CustomerDashboard/BookServiceForm"; // Import the new component

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("bookings"); // Default to bookings tab

  const renderTabContent = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingList />;
      case "book-service": // New tab for booking
        return <BookServiceForm />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <BookingList />; // Default to bookings
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <DashboardHeader />
        {/* Update DashboardTabs to include the new "Book Service" tab */}
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          // You'll need to pass the new tab name to DashboardTabs component
          tabs={["bookings", "book-service", "profile", "settings"]}
        />
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;