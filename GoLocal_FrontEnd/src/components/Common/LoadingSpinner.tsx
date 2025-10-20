// src/components/Common/LoadingSpinner.tsx

import React from 'react';
import './LoadingSpinner.css'; // Import the CSS for the spinner

interface LoadingSpinnerProps {
  /**
   * Optional message to display below the spinner.
   * @default "Loading..."
   */
  message?: string;
  /**
   * Optional size for the spinner.
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Optional additional class names for custom styling.
   */
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "medium",
  className,
}) => {
  return (
    <div className={`loading-spinner-container ${className || ''}`}>
      <div className={`spinner ${size}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;