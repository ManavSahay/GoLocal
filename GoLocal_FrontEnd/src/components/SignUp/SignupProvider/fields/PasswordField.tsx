// import React from 'react';
// import { Eye, EyeOff } from 'lucide-react';

// interface PasswordFieldProps {
//     id: string;
//     name: string;
//     label: string;
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     showPassword: boolean;
//     toggleShowPassword: () => void;
//     placeholder?: string;
//     required?: boolean;
// }

// const PasswordField: React.FC<PasswordFieldProps> = ({
//     id,
//     name,
//     label,
//     value,
//     onChange,
//     showPassword,
//     toggleShowPassword,
//     placeholder,
//     required,
// }) => {
//     return (
//         <div>
//             <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
//                 {label}
//             </label>
//             <div className="relative">
//                 <input
//                     type={showPassword ? 'text' : 'password'}
//                     id={id}
//                     name={name}
//                     value={value}
//                     onChange={onChange}
//                     required={required}
//                     className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80"
//                     placeholder={placeholder}
//                 />
//                 <button
//                     type="button"
//                     onClick={toggleShowPassword}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                     {showPassword ? (
//                         <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     ) : (
//                         <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PasswordField;