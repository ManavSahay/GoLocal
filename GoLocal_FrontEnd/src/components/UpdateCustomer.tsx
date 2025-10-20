// src/components/UpdateCustomer.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Customer } from './exportTypes'; // Ensure Customer type is correctly imported
import { AlertTriangle, CheckCircle, Edit, Save, XCircle } from 'lucide-react'; // Added Save and XCircle icons

interface UpdateCustomerProps {
  customer: Customer; // The customer object to be updated
  onUpdateSuccess: (updatedCustomer: Customer) => void; // Callback after successful update
  onCancel: () => void; // Callback for when the user cancels
}

const UpdateCustomer: React.FC<UpdateCustomerProps> = ({ customer, onUpdateSuccess, onCancel }) => {
  // State to hold the form data, initialized with the passed customer prop
  const [formData, setFormData] = useState<Customer>(customer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null); // To handle new file upload

  // Effect to update form data if the 'customer' prop changes (e.g., if a different customer is selected for edit)
  useEffect(() => {
    setFormData(customer);
    setProfilePictureFile(null); // Clear any pending file selection
    setError(null);
    setSuccess(null);
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProfilePictureFile(file); // Store the file object
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    const validationErrors: string[] = [];

    // Check for non-empty strings (after trimming whitespace)
    if (!formData.customerName?.trim()) { // Using optional chaining and nullish coalescing for safety
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

    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" ")); // Join all errors into one message
      setLoading(false); // Stop loading if validation fails
      return;
    }
    try {
      const dataToSend: any = { ...formData }; // Start with current form data

      // Handle profile picture file conversion to Base64 if a new file is selected
      if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = () => {
            const base64StringWithPrefix = reader.result as string;
            dataToSend.profilePicture = base64StringWithPrefix.split(',')[1]; // Remove prefix
            resolve();
          };
          reader.onerror = (errorEvent) => {
            console.error("FileReader error:", errorEvent);
            setError("Failed to read profile picture file. Please try another image.");
            setLoading(false);
            reject(errorEvent);
          };
        });
        if (error) return; // Stop if file reading failed
      } else {
        // If no new file is selected, retain the existing profilePicture string or null
        dataToSend.profilePicture = formData.profilePicture;
      }

      // Important: Ensure mobileNumber is sent as a string if your backend expects it that way
      dataToSend.mobileNumber = String(dataToSend.mobileNumber);

      // Make the PUT request to update the customer
      // Assuming your backend expects the username in the path for update
      const response = await axios.put<Customer>(
        `http://localhost:8080/api/admin/update-customer/${formData.username}`, // Use username for update API
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(`Customer '${response.data.customerName}' updated successfully!`);
      onUpdateSuccess(response.data); // Notify parent with the updated customer data

    } catch (err: any) {
      console.error("Error updating customer:", err);
      setError(err.response?.data?.message || err.message || "Failed to update customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Edit className="h-6 w-6 mr-2 text-blue-600" /> Update Customer Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username (Read-only as it's likely an identifier) */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            readOnly // Make username read-only
          />
        </div>

        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text" // Keep as text to allow flexible input, but validate pattern
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[0-9]{10,15}" // Example: 10-15 digits
            title="Mobile number should contain only digits (e.g., 10-15 characters)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          {formData.profilePicture && !profilePictureFile && (
            <div className="mt-2 mb-2">
              <span className="text-sm text-gray-600">Current Picture:</span>
              <img
                src={`data:image/jpeg;base64,${formData.profilePicture}`} // Assuming JPEG, adjust if needed
                alt="Current Profile"
                className="w-20 h-20 rounded-full object-cover mt-1 border border-gray-200"
              />
            </div>
          )}
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept="image/*" // Only allow image files
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
            <Save className="h-4 w-4 mr-2" /> {loading ? 'Updating...' : 'Update Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCustomer;