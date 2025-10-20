// // src/components/SignUp/UserTypeToggle.tsx (or wherever your component is)

// import React, { Dispatch, SetStateAction } from 'react';

// // 1. Define the props interface
// interface UserTypeToggleProps {
//   currentType: "provider" | "customer";
//   onSwitch: Dispatch<SetStateAction<"provider" | "customer">>;
// }

// // 2. Use the interface in your functional component
// const UserTypeToggle: React.FC<UserTypeToggleProps> = ({ currentType, onSwitch }) => {
//   return (
//     <div className="flex justify-center mb-8">
//       <button
//         onClick={() => onSwitch("customer")}
//         className={`px-6 py-3 rounded-l-lg text-lg font-semibold transition-colors duration-200
//           ${currentType === "customer" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
//         `}
//       >
//         I'm a Customer
//       </button>
//       <button
//         onClick={() => onSwitch("provider")}
//         className={`px-6 py-3 rounded-r-lg text-lg font-semibold transition-colors duration-200
//           ${currentType === "provider" ? "bg-green-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
//         `}
//       >
//         I'm a Provider
//       </button>
//     </div>
//   );
// };

// export default UserTypeToggle;