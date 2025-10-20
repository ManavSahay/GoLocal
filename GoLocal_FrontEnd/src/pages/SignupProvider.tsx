import React, { useState } from "react";
import {
  ProviderIllustration,
  SignupForm,
  UserTypeToggle
} from "../components/SignUp";


const SignupHelper: React.FC = () => {
  const [userType, setUserType] = useState<"provider" | "customer">("provider");


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background floating shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 opacity-30 rounded-full animate-float" />
        <div
          className="absolute top-32 right-20 w-16 h-16 bg-purple-200 opacity-40 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 opacity-35 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>


      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join as a Service Provider
          </h1>
          <p className="text-gray-600 text-lg">
            Register now to offer your local services and grow your business
          </p>
        </div>


        {/* User Type Toggle */}
        <UserTypeToggle currentType={userType} onSwitch={setUserType} />


        {/* Form and Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SignupForm role={"ROLE_PROVIDER"} />
          <ProviderIllustration />
        </div>
      </div>
    </div>
  );
};


export default SignupHelper;





