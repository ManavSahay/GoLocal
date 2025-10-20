// import React from 'react';
// import { LucideIcon } from 'lucide-react';

// interface SignupInputProps {
//     id: string;
//     name: string;
//     label: string;
//     type: string;
//     value: string | number;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     placeholder?: string;
//     icon?: LucideIcon;
//     required?: boolean;
//     pattern?: string;
//     maxLength?: number;
//     min?: string;
//     max?: string;
// }

// const SignupInputProv: React.FC<SignupInputProps> = ({
//     id,
//     name,
//     label,
//     type,
//     value,
//     onChange,
//     placeholder,
//     icon: Icon,
//     required,
//     pattern,
//     maxLength,
//     min,
//     max,
// }) => {
//     return (
//         <div>
//             <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
//                 {label}
//             </label>
//             <div className="relative">
//                 {Icon && (
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                         <Icon className="h-5 w-5 text-gray-400" />
//                     </div>
//                 )}
//                 <input
//                     type={type}
//                     id={id}
//                     name={name}
//                     value={value}
//                     onChange={onChange}
//                     required={required}
//                     className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80`}
//                     placeholder={placeholder}
//                     pattern={pattern}
//                     maxLength={maxLength}
//                     min={min}
//                     max={max}
//                 />
//             </div>
//         </div>
//     );
// };

// export default SignupInputProv;