// src/components/UpdateProvider.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Provider, Services } from './exportTypes';
import { AlertTriangle, CheckCircle, Edit, Save, XCircle } from 'lucide-react';

interface UpdateProviderProps {
  provider: Provider;
  onUpdateSuccess: (updatedProvider: Provider) => void;
  onCancel: () => void;
}

const UpdateProvider: React.FC<UpdateProviderProps> = ({ provider, onUpdateSuccess, onCancel }) => {

  // UPDATED decodeDescription function
  const decodeDescription = (descriptionData: Provider['description']): string => {
    if (typeof descriptionData === 'string') {
      const base64Regex = /^[A-Za-z0-9+/=]+$/;
      if (base64Regex.test(descriptionData) && descriptionData.length % 4 === 0) {
        try {
          return atob(descriptionData);
        } catch (e) {
          console.warn("Failed to decode description as base64, treating as plain string:", e);
          return descriptionData;
        }
      }
      return descriptionData;
    }

    if (descriptionData instanceof ArrayBuffer) {
      try {
        return new TextDecoder('utf-8').decode(new Uint8Array(descriptionData));
      } catch (e) {
        console.error("Error decoding ArrayBuffer description:", e);
        return "Decoding Error (ArrayBuffer)";
      }
    }

    if (typeof descriptionData === 'object' && descriptionData !== null && 'data' in descriptionData && Array.isArray((descriptionData as any).data)) {
      try {
        return new TextDecoder('utf-8').decode(new Uint8Array((descriptionData as any).data));
      } catch (e) {
        console.error("Error decoding byte array description:", e);
        return "Decoding Error (Byte Array)";
      }
    }

    if (descriptionData instanceof Blob) {
      console.warn("Description is a Blob. Cannot synchronously decode for initial state.");
      return "Loading Description...";
    }

    console.warn("Unexpected description type:", typeof descriptionData, descriptionData);
    return "Unknown Description Format";
  };

  const [formData, setFormData] = useState<Provider>(() => {
    // Ensure initial state correctly decodes description
    return {
      ...provider,
      description: decodeDescription(provider.description)
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    // This useEffect ensures the form resets and populates correctly
    // when a new provider is selected (if this component is reused)
    setFormData({
      ...provider,
      description: decodeDescription(provider.description)
    });
    setProfilePictureFile(null); // Clear any previously selected file
    setError(null);
    setSuccess(null);
  }, [provider]); // Dependency array: re-run if 'provider' prop changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear errors on input change
    setSuccess(null); // Clear success message on input change
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProfilePictureFile(file);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading immediately
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages

    // --- REFINED CLIENT-SIDE VALIDATION ---
    const validationErrors: string[] = [];

    // Check for non-empty strings (after trimming whitespace)
    if (!formData.providerName?.trim()) { // Using optional chaining and nullish coalescing for safety
      validationErrors.push("Provider Name is required.");
    }
    if (!formData.location?.trim()) {
      validationErrors.push("Location is required.");
    }
    // Mobile number validation, ensure it's a string and not empty after trim
    if (!formData.mobileNumber || String(formData.mobileNumber).trim() === '') {
      validationErrors.push("Mobile Number is required.");
    } else if (!/^[0-9]{10,15}$/.test(String(formData.mobileNumber))) { // Re-check pattern
      validationErrors.push("Mobile number should contain 10-15 digits.");
    }
    if (!formData.email?.trim()) {
      validationErrors.push("Email is required.");
    }
    // For numbers, check if it's explicitly null/undefined OR if it's not a finite number
    // parseFloat handles empty string to NaN, which is good for validation
    if (formData.rating === null || formData.rating === undefined || isNaN(parseFloat(String(formData.rating)))) {
        validationErrors.push("Rating is required and must be a number.");
    } else if (parseFloat(String(formData.rating)) < 0 || parseFloat(String(formData.rating)) > 5) {
        validationErrors.push("Rating must be between 0 and 5.");
    }

    if (formData.experience === null || formData.experience === undefined || isNaN(parseFloat(String(formData.experience)))) {
        validationErrors.push("Experience is required and must be a number.");
    } else if (parseFloat(String(formData.experience)) < 0) {
        validationErrors.push("Experience cannot be negative.");
    }

    if (!formData.description) {
      validationErrors.push("Description is required.");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(" ")); // Join all errors into one message
      setLoading(false); // Stop loading if validation fails
      return;
    }
    // --- END REFINED VALIDATION ---

    try {
      const dataToSend: any = { ...formData }; // Start with a copy of current form data

      // Handle profile picture
      if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = () => {
            const base64StringWithPrefix = reader.result as string;
            // Extract only the base64 part, removing "data:image/jpeg;base64," prefix
            dataToSend.profilePicture = base64StringWithPrefix.split(',')[1];
            resolve();
          };
          reader.onerror = (errorEvent) => {
            console.error("FileReader error:", errorEvent);
            setError("Failed to read profile picture file. Please try another image.");
            setLoading(false);
            reject(errorEvent);
          };
        });
        if (error) return; // If FileReader error occurred, stop submission
      } else {
        // If no new file is selected, retain the existing profile picture base64 string
        dataToSend.profilePicture = formData.profilePicture;
      }

      // Ensure data types are correct for backend (if backend expects strings for numbers)
      // This is often *not* needed if your backend correctly parses JSON numbers,
      // but if you're certain it expects strings, keep these.
      // If your backend expects numbers, remove these String() conversions.
      dataToSend.mobileNumber = String(dataToSend.mobileNumber);
      dataToSend.rating = parseFloat(String(dataToSend.rating)); // Send as number if backend expects it
      dataToSend.experience = parseFloat(String(dataToSend.experience)); // Send as number
      dataToSend.description = String(formData.description); // Ensure it's sent as a string


      const response = await axios.put<Provider>(
        `http://localhost:8080/api/admin/update-provider/${formData.username}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json' // Explicitly set content type
          }
        }
      );

      setSuccess(`Provider '${response.data.providerName}' updated successfully!`);
      onUpdateSuccess(response.data); // Notify parent component of success
      // Consider adding a setTimeout here to clear success message if desired
      // setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      console.error("Error updating provider:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || "Failed to update provider. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false after attempt
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Edit className="h-6 w-6 mr-2 text-blue-600" /> Update Provider Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username (Read-only) */}
        <div>
          <label htmlFor="providerUsername" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="providerUsername"
            name="username"
            value={formData.username}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            readOnly
          />
        </div>

        {/* Provider Name */}
        <div>
          <label htmlFor="providerName" className="block text-sm font-medium text-gray-700">
            Provider Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="providerName"
            name="providerName"
            value={formData.providerName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="providerLocation" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="providerLocation"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="providerMobileNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="providerMobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[0-9]{10,15}"
            title="Mobile number should contain only digits (e.g., 10-15 characters)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="providerEmail" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="providerEmail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        

        {/* Experience */}
        <div>
          <label htmlFor="providerExperience" className="block text-sm font-medium text-gray-700">
            Experience (Years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="providerExperience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="providerDescription" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="providerDescription"
            name="description"
            value={formData.description as string}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Read-only fields for service and booking counts */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Name
          </label>
          <input
            type="text"
            value={formData.service?.serviceName || 'N/A'}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Times Booked
          </label>
          <input
            type="text"
            value={String(formData.noOfTimesBooked)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            readOnly
          />
        </div>


        {/* Profile Picture */}
        <div>
          <label htmlFor="providerProfilePicture" className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          {formData.profilePicture && !profilePictureFile && (
            <div className="mt-2 mb-2">
              <span className="text-sm text-gray-600">Current Picture:</span>
              <img
                src={`data:image/jpeg;base64,${formData.profilePicture}`}
                alt="Current Profile"
                className="w-20 h-20 rounded-full object-cover mt-1 border border-gray-200"
              />
            </div>
          )}
          <input
            type="file"
            id="providerProfilePicture"
            name="profilePicture"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept="image/*"
          />
          <p className="mt-1 text-xs text-gray-500">
            Select a new image to update the profile picture.
          </p>
        </div>

        {/* Status Messages (Error/Success) */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <AlertTriangle className="inline h-4 w-4 mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <CheckCircle className="inline h-4 w-4 mr-2" />
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <XCircle className="h-4 w-4 mr-2" /> Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" /> {loading ? 'Updating...' : 'Update Provider'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProvider;