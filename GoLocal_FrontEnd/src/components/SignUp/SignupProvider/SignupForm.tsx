// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { User as FileText } from "lucide-react";


// import { useAuth } from "../../../contexts/AuthContext";
// import { Service } from "../../../types/service";


// import SignupInputProv from "../SignupCustomer/fields/SignupInput"; // Assuming this is correct
// import PasswordField from "./fields/PasswordField"; // Make sure this path is correct
// import PhotoUpload from "./fields/PhotoUpload";
// import SelectOccupation from "./fields/SelectOccupation";


// const SignupProviderForm: React.FC = () => {
//   const { register, getAllServices } = useAuth();
//   const navigate = useNavigate();


//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     providerName: "",
//     mobileNumber: "",
//     email: "",
//     location: "",
//     experience: "",
//     description: "",
//     serviceId: "",
//   });


//   const [services, setServices] = useState<Service[]>([]);
//   const [serviceLoading, setServiceLoading] = useState(true);
//   const [serviceError, setServiceError] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [base64Image, setBase64Image] = useState<string | null>(null);

//   // State for password visibility
//   const [showPassword, setShowPassword] = useState(false);


//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         setServiceLoading(true);
//         const data = await getAllServices(); // ✅ from AuthContext
//         // Ensure that the 'data' structure matches the 'Service[]' type
//         // If getAllServices returns an object with a 'services' array (e.g., { services: [...] }), adjust this.
//         setServices(data ? data : []);
//         setServiceError(null);
//       } catch (err) {
//         setServiceError("Failed to load service categories");
//       } finally {
//         setServiceLoading(false);
//       }
//     };


//     fetchServices();
//   }, [getAllServices]);


//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };


//   const handlePhotoUpload = (file: File | null, base64: string | null) => {
//     setSelectedFile(file);
//     setBase64Image(base64);
//     if (file && !base64) setError("Failed to read image file.");
//     else setError(null);
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     const {
//         username,
//         password,
//         providerName,
//         mobileNumber,
//         email,
//         location,
//         experience,
//         description,
//         serviceId,
//     } = formData;

//     if (
//         !username ||
//         !password ||
//         !providerName ||
//         !mobileNumber ||
//         !email ||
//         !location ||
//         !experience ||
//         !description ||
//         !serviceId
//     ) {
//         setError("Please fill in all required fields.");
//         setLoading(false);
//         return;
//     }

//     if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
//         setError("Invalid mobile number.");
//         setLoading(false);
//         return;
//     }

//     const service = services?.find((s) => s.id === serviceId);
//     if (!service) {
//         setError("Invalid service selection.");
//         setLoading(false);
//         return;
//     }

//     // --- FIX STARTS HERE ---
//     const registrationFormData = new FormData();

//     // Append all text fields
//     registrationFormData.append("username", username);
//     registrationFormData.append("password", password);
//     registrationFormData.append("role", "ROLE_PROVIDER"); // Append role as a string
//     registrationFormData.append("providerName", providerName);
//     registrationFormData.append("mobileNumber", mobileNumber); // Send as string, backend will parse
//     registrationFormData.append("email", email);
//     registrationFormData.append("location", location);
//     registrationFormData.append("experience", experience); // Send as string, backend will parse
//     registrationFormData.append("description", description);
//     registrationFormData.append("isDeleted", "false"); // Boolean as string

//     // Handle profilePicture: If selectedFile exists, append the File object.
//     // Otherwise, append the base64 string or a default value.
//     if (selectedFile) {
//         registrationFormData.append("profilePicture", selectedFile);
//     } else if (base64Image) {
//         // If you need to send base64 as a file, you'd convert it to a Blob:
//         // const byteCharacters = atob(base64Image.split(',')[1]);
//         // const byteNumbers = new Array(byteCharacters.length);
//         // for (let i = 0; i < byteCharacters.length; i++) {
//         //     byteNumbers[i] = byteCharacters.charCodeAt(i);
//         // }
//         // const byteArray = new Uint8Array(byteNumbers);
//         // const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust type as needed
//         // registrationFormData.append("profilePicture", blob, "profile.jpg");

//         // Alternatively, if backend accepts base64 string directly:
//         registrationFormData.append("profilePicture", base64Image);
//     } else {
//         registrationFormData.append("profilePicture", "default.jpg");
//     }

//     // Backend expects 'service' as an object, but FormData can only append strings or Blobs/Files directly.
//     // If your backend endpoint for register-provider expects a nested JSON object for 'service',
//     // you might need to stringify it and append it as a string.
//     // However, it's more common for backend to expect serviceId and serviceName as separate fields
//     // or to expect a JSON string that it then parses.
//     // Let's assume for now your backend can parse a stringified JSON for 'service'.
//     registrationFormData.append(
//         "service",
//         JSON.stringify({
//             serviceId: service.id,
//             serviceName: service.name,
//         })
//     );
   
//     try {
//         // Pass the FormData object and the role
//         const success = await register(registrationFormData, "ROLE_PROVIDER");
//         if (success) {
//             alert("Registration successful!");
//             navigate("/auth");
//         } else {
//             setError("Registration failed. Try again.");
//         }
//     } catch (err: any) {
//         setError(err.response?.data?.message || "An unexpected error occurred.");
//     } finally {
//         setLoading(false);
//     }
// };


//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && <div className="text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</div>}


//       {/* Name & Phone */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <SignupInputProv
//           id="providerName"
//           name="providerName"
//           label="Full Name"
//           type="text"
//           value={formData.providerName}
//           onChange={handleChange}
//           placeholder="Your full name"
//           // icon={UserIcon} // Uncomment if SignupInputProv supports an icon prop
//           required
//         />
//         <SignupInputProv
//           id="mobileNumber"
//           name="mobileNumber"
//           label="Mobile Number"
//           type="tel"
//           value={formData.mobileNumber}
//           onChange={handleChange}
//           placeholder="10-digit number"
//           // icon={Phone} // Uncomment if SignupInputProv supports an icon prop
//           required
//           // pattern="^[6-9]\d{9}$" // This pattern is better handled via native HTML5 validation or form library
//         />
//       </div>


//       {/* Email & Location */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <SignupInputProv
//           id="email"
//           name="email"
//           label="Email"
//           type="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Your email"
//           // icon={Mail} // Uncomment if SignupInputProv supports an icon prop
//           required
//         />
//         <SignupInputProv
//           id="location"
//           name="location"
//           label="Location"
//           type="text"
//           value={formData.location}
//           onChange={handleChange}
//           placeholder="City or area"
//           // icon={MapPin} // Uncomment if SignupInputProv supports an icon prop
//           required
//         />
//       </div>


//       {/* Username & Photo */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <SignupInputProv
//           id="username"
//           name="username"
//           label="Username"
//           type="text"
//           value={formData.username}
//           onChange={handleChange}
//           placeholder="Unique username"
//           required
//         />
//         <PhotoUpload
//           id="profilePicture"
//           name="profilePicture"
//           onPhotoChange={handlePhotoUpload}
//           fileName={selectedFile?.name || null}
//           previewBase64={base64Image}
//         />
//       </div>


//       {/* Service & Experience */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <SelectOccupation
//           id="serviceId"
//           name="serviceId"
//           label="Service Category"
//           value={formData.serviceId}
//           onChange={handleChange}
//           loading={serviceLoading}
//           error={serviceError}
//           options={services}
//           required
//         />
//         <SignupInputProv
//           id="experience"
//           name="experience"
//           label="Years of Experience"
//           type="number"
//           value={formData.experience}
//           onChange={handleChange}
//           placeholder="e.g., 3"
//           required
//         />
//       </div>


//       {/* Description */}
//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//           Service Description
//         </label>
//         <div className="relative">
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={3}
//             className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Describe your services and experience"
//             required
//           />
//           <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
//         </div>
//       </div>


//       {/* Password */}
//       <PasswordField
//         id="password"
//         name="password"
//         label="Password"
//         value={formData.password}
//         onChange={handleChange}
//         showPassword={showPassword} // Correct prop name
//         toggleShowPassword={() => setShowPassword(prev => !prev)} // Correct prop name
//         placeholder="Create a strong password" // Good to include
//         required // Good to include
//       />


//       <button
//         type="submit"
//         className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         disabled={loading}
//       >
//         {loading ? "Registering..." : "Register as Service Provider"}
//       </button>
//     </form>
//   );
// };
// export default SignupProviderForm;