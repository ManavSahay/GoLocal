// /components/Signup/SignupCustomer/CustomerIllustration.tsx

import React from "react";

const CustomerIllustration: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <img
            src="https://images.pexels.com/photos/4246126/pexels-photo-4246126.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Happy customer"
            className="w-80 h-80 object-cover rounded-3xl shadow-2xl animate-float"
          />
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-2xl shadow-lg animate-bounce">
            😊
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold text-purple-600">15K+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Find Trusted Local Help
        </h3>
        <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
          Get tasks done easily by verified professionals. Fast, reliable, and
          right at your doorstep.
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <StatCard value="99%" label="Satisfaction Rate" color="green" />
          <StatCard value="4.9★" label="Avg. Service Rating" color="blue" />
          <StatCard value="Instant" label="Booking Available" color="purple" />
          <StatCard value="Secure" label="Payments & Support" color="orange" />
        </div>
      </div>
    </div>
  );
};

export default CustomerIllustration;

// Utility component
const StatCard = ({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) => {
  const colorClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  }[color];

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
      <div className={`text-2xl font-bold mb-1 ${colorClass}`}>{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};
