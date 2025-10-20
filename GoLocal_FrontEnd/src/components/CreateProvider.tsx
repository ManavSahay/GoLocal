// src/components/CreateProvider.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { Provider ,Services } from './exportTypes'; // Ensure Provider and Services types are correctly defined here

// Defines the shape of the form data for creating a new Provider.
// It now includes 'serviceName' in addition to 'serviceId'.
interface NewProviderFormData {
  // Fields for the associated user account (username, password, role, etc.)
  username: string;
  password: string;
  role: string;
  isDeleted: boolean;

  // Fields for the provider's specific profile
  providerName: string;
  location: string;
  mobileNumber: string; // Will be sent as a string
  email: string;
  profilePicture: File | null; // For the file input (converted to Base64 before sending)
  serviceId: string;   // Input for linking/identifying the service
  serviceName: string; // NEW: Input for the service name
  experience: number;
  description: string; // Will be sent as a string
}

// Props for the CreateProvider component.
interface CreateProviderProps {
  onProviderCreated: (newProvider: Provider) => void; // Callback after successful provider creation
  onCancel: () => void; // Callback for when the user cancels
}

const CreateProvider: React.FC<CreateProviderProps> = ({ onProviderCreated, onCancel }) => {
  // State to manage the form inputs
  const [formData, setFormData] = useState<NewProviderFormData>({
    username: '',
    password: '',
    role: 'ROLE_PROVIDER', // Default role for a new provider
    isDeleted: false,      // New providers are active by default

    providerName: '',
    location: '',
    mobileNumber: '',
    email: '',
    profilePicture: null,
    serviceId: '',
    serviceName: '', // Initialize new serviceName field
    experience: 0,
    description: '',
  });

  // States for UI feedback (loading, errors, success messages)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handles input changes for text, email, number, and textarea fields.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Converts value to a number if the input type is "number".
    const parsedValue = (e.target as HTMLInputElement).type === 'number' ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    setError(null); // Clear previous errors on input change
    setSuccess(null); // Clear previous success messages on input change
  };

  // Handles changes specifically for the file input (profile picture).
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({
      ...prev,
      profilePicture: file,
    }));
    setError(null);
    setSuccess(null);
  };

  // Handles the form submission logic.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Client-side validation: Ensure all critical fields are filled.
    if (
      !formData.username ||
      !formData.password ||
      !formData.providerName ||
      !formData.location ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.serviceId ||
      !formData.serviceName || // NEW: Validate serviceName
      formData.experience === undefined ||
      !formData.description
    ) {
      setError("Please fill in all required fields marked with *.");
      setLoading(false);
      return;
    }

    try {
      // Prepare the data payload to send to the backend.
      // The `service` property now explicitly includes `serviceId` and `serviceName`.
      const dataToSend: {
        username: string;
        password?: string;
        role?: string;
        isDeleted?: boolean;

        providerName: string;
        location: string;
        mobileNumber: string;
        email: string;
        rating: string;
        profilePicture: string | null;
        noOfBookings: number;
        service: { serviceId: string; serviceName: string; noOfUser: number }; // Backend will manage noOfUser
        experience: number;
        description: string;
        noOfTimesBooked: number;
      } = {
        // User Account Data
        username: formData.username,
        password: formData.password,
        role: formData.role,
        isDeleted: formData.isDeleted,

        // Provider Profile Data
        providerName: formData.providerName,
        location: formData.location,
        mobileNumber: formData.mobileNumber, // Sent as string
        email: formData.email,
        experience: formData.experience,
        description: formData.description, // Sent as string

        // Default values for fields managed by the backend
        rating: "0",          // Initial rating (as string)
        noOfBookings: 0,      // Initial number of bookings
        noOfTimesBooked: 0,   // Initial count for provider


        profilePicture: null,

        // Service association: Sending serviceId and serviceName.
        // Backend should handle `noOfUser` (e.g., initialize to 0 or increment if linking to existing).
        service: {
            serviceId: formData.serviceId,
            serviceName: formData.serviceName,
            noOfUser: 0 // Frontend sends 0, backend should manage this value (e.g., retrieve existing or set initial)
        }
      };

      // Handle the conversion of the selected profile picture file to a Base64 string.
      if (formData.profilePicture) {
        const reader = new FileReader();
        reader.readAsDataURL(formData.profilePicture); // Reads file as Data URL (Base64)

        // Asynchronously wait for the file reading to complete.
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = () => {
            const base64StringWithPrefix = reader.result as string;
            // Remove the "data:image/image-type;base64," prefix.
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
        if (error) return; // Exit if file reading failed
      } else {
        dataToSend.profilePicture = null; // Send null if no picture uploaded
      }

      // Send the data to the backend API.
      const response = await axios.post<Provider>(
        'http://localhost:8080/api/admin/create-provider', // **Crucially, confirm this is your correct backend endpoint!**
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach JWT token
            'Content-Type': 'application/json' // Set content type for JSON payload
          }
        }
      );

      // On successful creation:
      setSuccess(`Provider '${response.data.providerName}' created successfully!`);
      onProviderCreated(response.data); // Notify the parent component with the newly created provider data
      
      // Reset the form for a fresh entry
      setFormData({
        username: '', password: '', role: 'ROLE_PROVIDER', isDeleted: false,
        providerName: '', location: '', mobileNumber: '', email: '',
        profilePicture: null, serviceId: '', serviceName: '', experience: 0, description: '',
      });

    } catch (err: any) {
      console.error("Error creating provider:", err);
      // Display a relevant error message to the user
      setError(err.response?.data?.message || err.message || "Failed to create provider. Please try again.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Plus className="h-6 w-6 mr-2 text-blue-600" /> Create New Provider
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Account Fields */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Provider Profile Fields */}
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
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[0-9]{10,15}" // Example pattern for 10-15 digits
            title="Mobile number should contain only digits (e.g., 10-15 characters)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
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
        {/* Service Fields */}
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
            Service ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            placeholder="e.g., a UUID or unique service identifier"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
           <p className="mt-1 text-xs text-gray-500">
            This ID uniquely identifies the service.
          </p>
        </div>
        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            placeholder="e.g., 'Plumbing', 'Electrician Services'"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
           <p className="mt-1 text-xs text-gray-500">
            The name of the service this provider offers.
          </p>
        </div>
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Experience (Years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
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
          />
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Provider'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProvider;