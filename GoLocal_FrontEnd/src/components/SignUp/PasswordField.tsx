import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // --- CHANGES HERE ---
  showPassword: boolean; // Renamed from 'show' to 'showPassword'
  toggleShowPassword: () => void; // Renamed from 'setShow' to 'toggleShowPassword'
  placeholder?: string; // Added this prop as it's passed from SignupForm
  required?: boolean; // Added this prop as it's passed from SignupForm
  // --- END CHANGES ---
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  name,
  value,
  onChange,
  // --- CHANGES HERE ---
  showPassword, // Use the new prop name
  toggleShowPassword, // Use the new prop name
  placeholder, // Destructure the new prop
  required, // Destructure the new prop
  // --- END CHANGES ---
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"} // Use 'showPassword'
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required} // Apply the 'required' prop
          className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={placeholder || label} // Use the 'placeholder' prop, fallback to label
        />
        <button
          type="button"
          onClick={toggleShowPassword} // Use 'toggleShowPassword'
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? ( // Use 'showPassword'
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;