// profileTab.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
// Make sure to import the updated CustomerUpdatePayload
import { updateCustomer, CustomerUpdatePayload } from "./CustomerApi";
import { AlertTriangle, CheckCircle, Edit, Mail, MapPin, Phone, Star, User } from "lucide-react";

type CustomerProfile = {
  username: string;
  customerName: string;
  location: string;
  mobileNumber: string; // Keep as string for display and input binding
  email: string;
  rating: number;
  profilePicture?: string; // This will now be the Base64 string from the backend
};

const ProfileTab: React.FC = () => {
  const { user, loading: authLoading, token, refreshUser } = useAuth();

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    customerName: string; // Make these non-optional in formData as they will always be present
    location: string;
    mobileNumber: string;
    email: string;
  }>({
    customerName: "", // Initialize to empty strings to avoid uncontrolled component warnings
    location: "",
    mobileNumber: "",
    email: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      console.log("User object from AuthContext in ProfileTab:", user);
      const currentProfile: CustomerProfile = {
        username: user.username,
        customerName: user.customerName || "",
        location: user.location || "",
        mobileNumber: user.mobileNumber ? String(user.mobileNumber) : "",
        email: user.email || "",
        rating: user.rating !== undefined ? user.rating : 0,
        profilePicture: user.profilePicture,
      };
      setCustomerProfile(currentProfile);
      setFormData({
        customerName: user.customerName || "",
        location: user.location || "",
        mobileNumber: user.mobileNumber ? String(user.mobileNumber) : "",
        email: user.email || "",
      });
      setProfilePictureFile(null);
    }
  }, [user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProfilePictureFile(file);
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    setProfilePictureFile(null); // Clear file selection when entering edit mode
    // Re-initialize formData with current profile data
    if (customerProfile) {
      setFormData({
        customerName: customerProfile.customerName,
        location: customerProfile.location,
        mobileNumber: customerProfile.mobileNumber,
        email: customerProfile.email,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (customerProfile) {
      setFormData({
        customerName: customerProfile.customerName,
        location: customerProfile.location,
        mobileNumber: customerProfile.mobileNumber,
        email: customerProfile.email,
      });
    }
    setProfilePictureFile(null); // Clear selected file on cancel
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleSave = async () => {
    if (!user || !user.username || !token || !customerProfile) { // Added !customerProfile check
      setUpdateError("Authentication or profile information missing. Please log in.");
      return;
    }

    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      // Initialize payloadToSend with all required fields from current formData
      // and current user data for fields not in formData (like username, rating)
      // For profilePicture, we'll handle it separately below.
      const payloadToSend: CustomerUpdatePayload = {
        username: user.username, // Username is required by DTO
        customerName: formData.customerName,
        location: formData.location,
        email: formData.email,
        mobileNumber: 0, // Default or parse. Will be updated below.
        profilePicture: customerProfile.profilePicture || "", // Default to current or empty string
      };

      // Handle mobile number parsing
      if (formData.mobileNumber) {
        const parsedMobileNumber = parseInt(formData.mobileNumber, 10);
        if (isNaN(parsedMobileNumber)) {
          throw new Error("Mobile number must be a valid number.");
        }
        payloadToSend.mobileNumber = parsedMobileNumber;
      } else {
        // If mobile number is empty, send 0 as per backend Long type expectation with @NotBlank
        payloadToSend.mobileNumber = 0;
      }

      // Handle profile picture file upload: convert to Base64
      if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = () => {
            const base64StringWithPrefix = reader.result as string;
            payloadToSend.profilePicture = base64StringWithPrefix.split(',')[1];
            resolve();
          };
          reader.onerror = (errorEvent) => {
            console.error("FileReader error:", errorEvent);
            setUpdateError("Failed to read profile picture file. Please try another image.");
            setUpdateLoading(false);
            reject(errorEvent);
          };
        });
        if (updateError) return; // Stop if FileReader had an error
      } else if (profilePictureFile === null) {
        // If no new file is selected AND "Remove Current Picture" was clicked (or implicitly removed),
        // send an empty string for profilePicture as per @NotBlank on String type.
        // If `profilePicture` was already undefined on customerProfile and no new file, it will send ""
        // This is crucial because @NotBlank means it cannot be null or entirely absent.
        payloadToSend.profilePicture = "";
      }
      // If profilePictureFile is null and customerProfile.profilePicture exists,
      // and "Remove Current Picture" was *not* explicitly clicked, then
      // payloadToSend.profilePicture will retain customerProfile.profilePicture
      // which is the desired behavior for unchanged picture.

      // We no longer need to check Object.keys(payloadToSend).length === 0
      // because we are always sending all required fields.
      // We can add a simple check if any data has truly changed before calling API
      const hasChanges =
        formData.customerName !== customerProfile.customerName ||
        formData.location !== customerProfile.location ||
        (formData.mobileNumber ? parseInt(formData.mobileNumber, 10) : 0) !== (customerProfile.mobileNumber ? parseInt(customerProfile.mobileNumber, 10) : 0) || // Compare parsed numbers
        formData.email !== customerProfile.email ||
        (profilePictureFile !== null || (customerProfile.profilePicture && payloadToSend.profilePicture === "")) // If new file selected, or existing removed
        ;

      if (!hasChanges) {
        setUpdateSuccess("No changes detected.");
        setIsEditing(false);
        setUpdateLoading(false);
        return;
      }


      console.log("Updating profile for username:", user.username);
      console.log("Payload being sent:", payloadToSend);
      console.log("Auth Token starts with:", token ? token.substring(0, 10) + '...' : 'No Token');

      const updatedData = await updateCustomer(user.username, payloadToSend, token);
      console.log('Customer updated successfully:', updatedData);

      if (refreshUser) {
        // refreshUser should ideally fetch the latest user data including the new profile picture base64 string
        await refreshUser();
      }

      setUpdateSuccess("Profile updated successfully!");
      setIsEditing(false);
      setProfilePictureFile(null); // Clear selected file after successful save

    } catch (error: any) {
      setUpdateError(error.message || "Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Helper to determine the image source for display
  const getProfileImageSrc = () => {
    if (profilePictureFile) {
      // If a new file is selected, show its preview
      return URL.createObjectURL(profilePictureFile);
    } else if (customerProfile?.profilePicture) {
      // If no new file, but existing profile picture (base64 string)
      return `data:image/jpeg;base64,${customerProfile.profilePicture}`;
    }
    // Fallback if no picture exists
    return "https://via.placeholder.com/150";
  };


  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user || !customerProfile) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-red-600 text-lg">Failed to load profile. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-indigo-800 text-center mb-6">My Profile</h2>

      {updateSuccess && (
        <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-200 text-green-700">
          <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">{updateSuccess}</p>
        </div>
      )}
      {updateError && (
        <div className="flex items-center p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">{updateError}</p>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-6">
          {/* Profile Picture section */}
          <div className="flex flex-col items-center border-b pb-6 mb-6">
            <img
              src={getProfileImageSrc()}
              alt="Profile Preview"
              className="w-36 h-36 rounded-full object-cover border-4 border-indigo-400 shadow-md mb-4"
            />
            <label htmlFor="profilePictureInput" className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200">
                <Edit className="h-4 w-4 mr-2" />
                Upload New Picture
              </span>
              <input
                type="file"
                id="profilePictureInput"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {customerProfile.profilePicture || profilePictureFile ? (
              <button
                type="button"
                onClick={() => {
                  setProfilePictureFile(null); // Clear selected file
                  // This is the crucial part: When "Remove" is clicked, we need to ensure
                  // the profilePicture in the local state (customerProfile) is also cleared
                  // so that `getProfileImageSrc` shows the placeholder, AND when saving,
                  // an empty string is sent to the backend.
                  if (customerProfile) {
                    setCustomerProfile({ ...customerProfile, profilePicture: "" }); // Set to empty string for backend
                  }
                }}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold transition-colors duration-200"
              >
                Remove Current Picture
              </button>
            ) : null}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex flex-col">
              <label htmlFor="customerName" className="text-gray-700 font-medium mb-1">Name:</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="username" className="text-gray-700 font-medium mb-1">Username:</label>
              <p id="username" className="px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" /> {customerProfile.username}
              </p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 font-medium mb-1">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="mobileNumber" className="text-gray-700 font-medium mb-1">Mobile:</label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                pattern="[0-9]{10,15}"
                title="Mobile number must be 10-15 digits long and contain only numbers."
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="location" className="text-gray-700 font-medium mb-1">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="rating" className="text-gray-700 font-medium mb-1">Rating:</label>
              <p id="rating" className="px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" /> {customerProfile.rating?.toFixed(1) ?? "N/A"}★
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateLoading}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={updateLoading}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Header (Display Mode) */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
            <img
              src={getProfileImageSrc()}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-400 shadow-md flex-shrink-0"
            />
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-extrabold text-gray-900 mb-1">
                {customerProfile.customerName}
              </h4>
              <p className="text-lg text-gray-600 flex items-center justify-center md:justify-start mt-1">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-semibold">Username:</span> {customerProfile.username}
              </p>
              <p className="text-lg text-gray-600 flex items-center justify-center md:justify-start mt-1">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                <span className="font-semibold">Rating:</span> {customerProfile.rating?.toFixed(1) ?? "N/A"}★
              </p>
            </div>
          </div>

          {/* Profile Details (Display Mode) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
            <div className="flex items-center text-lg">
              <MapPin className="h-6 w-6 mr-3 text-indigo-600 flex-shrink-0" />
              <div>
                <span className="font-semibold">Location:</span> {customerProfile.location}
              </div>
            </div>
            <div className="flex items-center text-lg">
              <Phone className="h-6 w-6 mr-3 text-indigo-600 flex-shrink-0" />
              <div>
                <span className="font-semibold">Mobile:</span> {customerProfile.mobileNumber}
              </div>
            </div>
            <div className="flex items-center text-lg col-span-1 md:col-span-2">
              <Mail className="h-6 w-6 mr-3 text-indigo-600 flex-shrink-0" />
              <div>
                <span className="font-semibold">Email:</span> {customerProfile.email}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleEditClick}
              className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 flex items-center space-x-2 transition-colors duration-200"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;