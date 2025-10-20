import React from 'react';

interface SignupInputProps {
  id: string;
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  pattern?: string;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  isTextArea?: boolean;
  rows?: number;
}

const SignupInput: React.FC<SignupInputProps> = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = true,
  pattern,
  maxLength,
  min,
  max,
  isTextArea = false,
  rows = 3,
}) => {

  let renderedIcon: React.ReactNode = null;

  const commonProps = {
    id,
    name,
    value,
    onChange,
    required,
    className: `w-full py-3 pr-3 ${
      renderedIcon ? 'pl-10' : 'pl-3'
    } border border-gray-300 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`,
    placeholder,
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {renderedIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {renderedIcon}
          </div>
        )}
        {isTextArea ? (
          <textarea
            {...commonProps}
            rows={rows}
            maxLength={maxLength}
          />
        ) : (
          <input
            type={type}
            {...commonProps}
            pattern={pattern}
            maxLength={maxLength}
            min={min}
            max={max}
          />
        )}
      </div>
    </div>
  );
};

export default SignupInput;