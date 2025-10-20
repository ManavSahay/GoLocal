// // src/components/SignupForm.tsx

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { User as UserIcon, Phone, MapPin, Mail } from "lucide-react";
// import { useAuth } from "../../../contexts/AuthContext";

// import SignupInput from "./fields/SignupInput";
// import PasswordField from "./fields/PasswordField";
// import PhotoUpload from "./fields/PhotoUpload"; // Ensure this path is correct

// interface SignupFormProps {
//   role: "ROLE_CUSTOMER" | "ROLE_PROVIDER";
// }

// const SignupForm: React.FC<SignupFormProps> = ({ role }) => {
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const [showPassword, setShowPassword] = useState(false);
//   // Store both the File object and the Base64 string
//   const [selectedFile, setSelectedFile] = useState<File | null>(null); // To get the file name
//   const [profilePictureBase64, setProfilePictureBase64] = useState<string | null>(null); // For backend upload

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     name: "", // Unified name field for customerName/providerName
//     location: "",
//     mobileNumber: "",
//     email: "",
//     description: "", // For providers
//     serviceCategory: "", // For providers
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Updated handler to receive both File and Base64 string from PhotoUpload component
//   const handlePhotoUpload = (file: File | null, base64: string | null) => {
//     setSelectedFile(file);
//     setProfilePictureBase64(base64);
//     // You might want to handle error display if base64 is null, etc.
//     if (base64 === null && file !== null) { // If a file was selected but reading failed
//         setError("Failed to read image file.");
//     } else {
//         setError(null); // Clear error if successful or no file selected
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const mobileRegex = /^[6-9]\d{9}$/;
//     if (!mobileRegex.test(formData.mobileNumber)) {
//       setError("Please enter a valid 10-digit mobile number.");
//       setLoading(false);
//       return;
//     }

//     const form = new FormData();
//     form.append("username", formData.username);
//     form.append("password", formData.password);

//     // Dynamically append name field based on role
//     if (role === "ROLE_CUSTOMER") {
//       form.append("customerName", formData.name);
//       // *** IMPORTANT: Explicitly append the numeric role for customer
//       form.append("role", "0"); // ROLE_CUSTOMER ordinal is 0
//     } else if (role === "ROLE_PROVIDER") {
//       form.append("providerName", formData.name);
//       // *** IMPORTANT: Explicitly append the numeric role for provider
//       form.append("role", "1"); // ROLE_PROVIDER ordinal is 1
//     }

//     form.append("location", formData.location);
//     form.append("mobileNumber", formData.mobileNumber);
//     form.append("email", formData.email);

//     // Append the Base64 string if available
//     if (profilePictureBase64) {
//       form.append("profilePicture", profilePictureBase64); // This will now be the Base64 string
//     }

//     if (role === "ROLE_PROVIDER") {
//       form.append("description", formData.description);
//       form.append("serviceCategory", formData.serviceCategory);
//     }

//     try {
//       const success = await register(form, role); // Still passing FormData to AuthContext, it determines endpoint

//       if (success) {
//         alert("Registration successful! Welcome to Go Local.");
//         if (role === "ROLE_CUSTOMER") {
//           navigate("/customer-dashboard");
//         } else if (role === "ROLE_PROVIDER") {
//           navigate("/provider-dashboard");
//         }
//       } else {
//         // Error handling if register returns false (e.g., from AuthContext)
//         setError((prev) => prev || "Registration failed. Please check your details and try again.");
//       }
//     } catch (err: unknown) {
//       const axiosError = err as import("axios").AxiosError<{ message?: string }>;
//       const errorMsg =
//         axiosError.response?.data?.message || "Registration failed due to an unexpected error.";
//       console.error("Registration error:", errorMsg);
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && (
//         <div className="text-red-600 text-center bg-red-100 p-3 rounded-md">
//           {error}
//         </div>
//       )}

//       {/* Full Name & Mobile */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <SignupInput
//           id="name"
//           label={role === "ROLE_CUSTOMER" ? "Full Name" : "Provider Name"}
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder={role === "ROLE_CUSTOMER" ? "Full Name" : "Business Name"}
//           icon={<UserIcon />}
//         />
//         <SignupInput
//           id="mobile"
//           label="Mobile Number"
//           name="mobileNumber"
//           value={formData.mobileNumber}
//           onChange={handleChange}
//           placeholder="10-digit mobile number"
//           icon={<Phone />}
//         />
//       </div>

//       {/* Email & Location */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <SignupInput
//           id="email"
//           label="Email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Email address"
//           icon={<Mail />}
//         />
//         <SignupInput
//           id="location"
//           label="Location"
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//           placeholder="City or Area"
//           icon={<MapPin />}
//         />
//       </div>

//       {/* Username & Photo */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <SignupInput
//           id="username"
//           label="Username"
//           name="username"
//           value={formData.username}
//           onChange={handleChange}
//           placeholder="Unique Username"
//         />
//         {/* Pass the new props to PhotoUpload for integrated functionality */}
//         <PhotoUpload
//           id="photo"
//           name="photo"
//           onPhotoChange={handlePhotoUpload} // This handler now expects (file, base64)
//           fileName={selectedFile ? selectedFile.name : null}
//           previewBase64={profilePictureBase64}
//         />
//       </div>

//       {/* Provider-specific fields */}
//       {role === "ROLE_PROVIDER" && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <SignupInput
//             id="serviceCategory"
//             label="Service Category"
//             name="serviceCategory"
//             value={formData.serviceCategory}
//             onChange={handleChange}
//             placeholder="e.g., Plumbing, Electrical, Cleaning"
//           />
//           <SignupInput
//             id="description"
//             label="Description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="A brief description of your services"
//           />
//         </div>
//       )}

//       {/* Password Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <PasswordField
//           id="password"
//           label="Password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           show={showPassword}
//           setShow={setShowPassword}
//         />
//       </div>

//       <button
//         type="submit"
//         className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         disabled={loading}
//       >
//         {loading ? "Registering..." : `Register as ${role === "ROLE_CUSTOMER" ? "Customer" : "Service Provider"}`}
//       </button>
//     </form>
//   );
// };

// export default SignupForm;