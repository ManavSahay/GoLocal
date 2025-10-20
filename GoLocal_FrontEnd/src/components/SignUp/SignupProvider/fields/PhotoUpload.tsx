// import React, { useRef } from "react";
// import { Upload, FileText } from "lucide-react"; // Import FileText icon

// interface PhotoUploadProps {
//   id: string;
//   name: string;
//   // This onChange now needs to receive the File object and the Base64 string
//   // as the PhotoUpload component itself handles the file reading.
//   onPhotoChange: (file: File | null, base64: string | null) => void;
//   // New props to pass down from SignupForm
//   fileName: string | null; // The name of the selected file
//   previewBase64: string | null; // The Base64 string for preview/opening
// }

// const PhotoUpload: React.FC<PhotoUploadProps> = ({ id, name, onPhotoChange, fileName, previewBase64 }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the actual file input

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         const base64String = reader.result as string;
//         const base64Data = base64String.split(",")[1]; // Get only the Base64 data
//         onPhotoChange(file, base64Data); // Pass both file and Base64 string to parent
//       };

//       reader.onerror = (error) => {
//         console.error("Error reading file:", error);
//         onPhotoChange(null, null); // Clear data if error occurs
//       };

//       reader.readAsDataURL(file); // Read the file as a data URL
//     } else {
//       onPhotoChange(null, null); // Clear data if no file is selected (e.g., user cancels)
//     }
//   };

//   const handleClickToUpload = () => {
//     // Programmatically click the hidden file input when the visible label is clicked
//     fileInputRef.current?.click();
//   };

//   const handleFileNameClick = (e: React.MouseEvent<HTMLSpanElement>) => {
//     e.stopPropagation(); // Prevent the click from bubbling up to the outer label and reopening file dialog
//     if (previewBase64) {
//       const newWindow = window.open();
//       if (newWindow) {
//         // Attempt to infer MIME type based on extension, default to jpeg
//         const mimeType = fileName?.toLowerCase().endsWith('.png') ? 'image/png' :
//                          fileName?.toLowerCase().endsWith('.gif') ? 'image/gif' :
//                          'image/jpeg';
//         newWindow.document.body.innerHTML = `<img src="data:${mimeType};base64,${previewBase64}" style="max-width: 100%; height: auto; display: block; margin: auto;">`;
//         newWindow.document.title = fileName || 'Uploaded Image';
//       }
//     }
//   };

//   return (
//     <div>
//       <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
//         Profile Photo (Optional)
//       </label>
//       <div className="relative">
//         <input
//           type="file"
//           id={id} // Use id from props
//           name={name} // Use name from props
//           accept="image/*"
//           className="hidden" // Keep it hidden
//           onChange={handleFileChange} // Use the new handler here
//           ref={fileInputRef} // Attach the ref
//         />
//         <label
//           htmlFor={id} // Associate label with the input via id
//           className="w-full flex items-center justify-center px-3 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-white/80"
//           onClick={handleClickToUpload} // Attach click handler to the visible label
//         >
//           {fileName ? (
//             // Display filename if a file is selected
//             <div className="flex items-center">
//               <FileText className="h-5 w-5 text-blue-500 mr-2" /> {/* File icon */}
//               <span
//                 className="text-blue-600 hover:underline font-semibold"
//                 onClick={handleFileNameClick} // Handler for clicking the filename
//               >
//                 {fileName}
//               </span>
//               <span className="text-gray-500 ml-2 text-xs">(Click to view/change)</span>
//             </div>
//           ) : (
//             // Display "Upload Photo" placeholder
//             <>
//               <Upload className="h-5 w-5 text-gray-400 mr-2" />
//               <span className="text-gray-600">Upload Photo</span>
//             </>
//           )}
//         </label>
//       </div>
//       {/* Optional: Add a small circular preview below the upload area */}
//       {previewBase64 && fileName && (
//         <div className="mt-2 text-center">
//           <img
//             src={`data:image/jpeg;base64,${previewBase64}`} // Default to jpeg
//             alt="Profile Preview"
//             className="w-20 h-20 object-cover rounded-full mx-auto border border-gray-200 shadow-sm"
//           />
//         </div>
//       )}
//       <p className="text-xs text-gray-500 mt-1 text-center">PNG, JPG, GIF up to 10MB</p>
//     </div>
//   );
// };

// export default PhotoUpload;