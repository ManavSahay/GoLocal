// src/components/CreateCustomer.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Customer } from './exportTypes.tsx'; // Ensure this path is correct and includes .tsx
import { AlertTriangle, CheckCircle, Plus } from 'lucide-react';

// Corrected Interface: Includes user-related fields
interface NewCustomerFormData {
  username: string; // Added: For the associated user account
  password: string; // Added: For the associated user account (must be string)
  role: string; // Added: For the associated user account (e.g., "CUSTOMER")
  isDeleted: boolean; // Added: For the associated user account (defaults to false)

  customerName: string;
  location: string;
  mobileNumber: string;
  email: string;
  profilePicture: File | null;
}

interface CreateCustomerProps {
  onCustomerCreated: (newCustomer: Customer) => void;
  onCancel: () => void;
}

const CreateCustomer: React.FC<CreateCustomerProps> = ({ onCustomerCreated, onCancel }) => {
  // Corrected State Initialization: All fields are initialized
  const [formData, setFormData] = useState<NewCustomerFormData>({
    username: '', // Initialize username
    password: '', // Initialize password
    role: 'ROLE_CUSTOMER', // Default role for a new customer
    isDeleted: false, // Default to false for a new user/customer

    customerName: '',
    location: '',
    mobileNumber: '',
    email: '',
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setFormData(prev => ({
      ...prev,
      profilePicture: file,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation (add username and password to validation if required)
    if (!formData.username || !formData.password || !formData.customerName || !formData.location || !formData.mobileNumber || !formData.email) {
      setError("All fields (including username and password) are required.");
      setLoading(false);
      return;
    }

    try {
      // Prepare data for the backend.
      const dataToSend: any = { // Using 'any' for flexibility, ideally define a DTO type
        username: formData.username,
        password: formData.password,
        role: formData.role, // Send the default/chosen role
        isDeleted: formData.isDeleted, // Send the default isDeleted status

        customerName: formData.customerName,
        location: formData.location,
        mobileNumber: formData.mobileNumber, // Convert string to BigInt
        email: formData.email,
        rating: "0", // Default rating
        noOfBookings: 0, // Initial bookings
      };

      // Handle profile picture if it exists (assuming Base64 or URL string)
      if (formData.profilePicture) {
        // You'll need to read the file and convert it to Base64
        const reader = new FileReader();
        reader.readAsDataURL(formData.profilePicture);
        await new Promise<void>(resolve => {
            reader.onloadend = () => {
                const base64StringWithPrefix = reader.result as string; // Base64 string
                dataToSend.profilePicture = base64StringWithPrefix.split(',')[1];
                resolve();
            };
            reader.onerror = () => {
                setError("Failed to read profile picture file.");
                setLoading(false);
                resolve(); // Resolve to unblock, but error is set
            };
        });
        if (error) return; // Stop if file reading failed
      } else {
        dataToSend.profilePicture = null;
      }
      console.log(dataToSend.profilePicture);

      const response = await axios.post<Customer>(
        'http://localhost:8080/api/admin/create-customer', // Replace with your actual API endpoint
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json' // Keep as JSON if Base64ing image
            // Change to 'multipart/form-data' if sending File objects directly
          }
        }
      );

      setSuccess(`Customer '${response.data.customerName}' created successfully!`);
      onCustomerCreated(response.data); // Notify parent component
      setFormData({ // Clear form after successful submission
        username: '',
        password: '',
        role: 'ROLE_CUSTOMER', // Reset to default
        isDeleted: false, // Reset to default

        customerName: '',
        location: '',
        mobileNumber: '',
        email: '',
        profilePicture: null,
      });

    } catch (err: any) {
      console.error("Error creating customer:", err);
      setError(err.response?.data?.message || "Failed to create customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Plus className="h-6 w-6 mr-2 text-blue-600" /> Create New Customer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New: Username Input */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username  <span className="text-red-500">*</span>
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

        {/* New: Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password  <span className="text-red-500">*</span>
          </label> 
          <input
            type="password" // Use type="password" for security
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Existing Customer fields */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
            Customer Name  <span className="text-red-500">*</span>
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
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location  <span className="text-red-500">*</span>
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
            Mobile Number  <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[0-9]{10,15}"
            title="Mobile number should contain only digits (10-15 characters)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email  <span className="text-red-500">*</span>
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

        {/* Profile Picture Input */}
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
            {loading ? 'Creating...' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;