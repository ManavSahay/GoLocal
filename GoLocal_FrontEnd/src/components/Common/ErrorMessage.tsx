// src/components/Common/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  // You can add more props for customization, e.g.:
  // icon?: React.ReactNode; // For a custom error icon
  // className?: string; // For additional styling
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null; // Don't render if there's no message
  }

  return (
    <div
      role="alert" // Aiding accessibility
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      // Add more classes or inline styles if needed for specific designs
    >
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline ml-2">{message}</span>
      {/* Optional: Add a close button */}
      {/* <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 2.65a1.2 1.2 0 1 1-1.697-1.697l2.651-2.65-2.651-2.651a1.2 1.2 0 0 1 1.697-1.697l2.651 2.651 2.651-2.651a1.2 1.2 0 0 1 1.697 1.697l-2.651 2.65 2.651 2.651z"/></svg>
      </span> */}
    </div>
  );
};

export default ErrorMessage;