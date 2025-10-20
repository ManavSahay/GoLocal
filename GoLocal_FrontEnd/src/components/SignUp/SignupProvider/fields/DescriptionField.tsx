// import React from 'react';
// import { FileText } from 'lucide-react';

// interface DescriptionFieldProps {
//     id: string;
//     name: string;
//     label: string;
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//     placeholder?: string;
//     required?: boolean;
//     rows?: number;
// }

// const DescriptionField: React.FC<DescriptionFieldProps> = ({
//     id,
//     name,
//     label,
//     value,
//     onChange,
//     placeholder,
//     required,
//     rows = 3,
// }) => {
//     return (
//         <div>
//             <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
//                 {label}
//             </label>
//             <div className="relative">
//                 <div className="absolute top-3 left-3">
//                     <FileText className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <textarea
//                     id={id}
//                     name={name}
//                     value={value}
//                     onChange={onChange}
//                     rows={rows}
//                     required={required}
//                     className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none bg-white/80"
//                     placeholder={placeholder}
//                 />
//             </div>
//         </div>
//     );
// };

// export default DescriptionField;