// src/components/CreateService.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Services } from './exportTypes'; // Import the Services type (as defined for a single service)
import { PlusCircle, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface CreateServiceProps {
  onServiceCreated: (newService: Services) => void;
  onCancel: () => void;
}

const CreateService: React.FC<CreateServiceProps> = ({ onServiceCreated, onCancel }) => {
  const [serviceId, setServiceId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleServiceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    // Validation: max 3 capital letters
    if (value.length <= 3 && /^[A-Z]*$/.test(value)) {
      setServiceId(value);
      setError(null); // Clear error on valid input
    } else if (value.length > 3) {
      setError("Service ID must be a maximum of 3 capital letters.");
    } else if (!/^[A-Z]*$/.test(value)) {
      setError("Service ID must contain only capital letters.");
    }
    setSuccess(null); // Clear success message on input change
  };

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceName(e.target.value);
    setError(null); // Clear error on input change
    setSuccess(null); // Clear success message on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Final validation before submission
    if (!serviceId || !serviceName) {
      setError("Service ID and Service Name are required.");
      setLoading(false);
      return;
    }
    if (serviceId.length > 3 || !/^[A-Z]{1,3}$/.test(serviceId)) {
      setError("Service ID must be 1 to 3 capital letters.");
      setLoading(false);
      return;
    }

    try {
      // Assuming your backend API for creating a service expects these fields
      // and might auto-generate 'noOfUser' or initialize it to 0.
      const newServiceData = {
        serviceId: serviceId,
        serviceName: serviceName,
        noOfUser: 0 // Defaulting to 0, adjust if your backend expects or generates this differently
      };

      const response = await axios.post<Services>(
        'http://localhost:8080/api/admin/create-service', // Adjust this API endpoint as per your backend
        newServiceData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(`Service '${response.data.serviceName}' created successfully!`);
      // Clear form fields after successful creation
      setServiceId('');
      setServiceName('');
      onServiceCreated(response.data); // Notify parent component with the newly created service
    } catch (err: any) {
      console.error("Error creating service:", err);
      setError(err.response?.data?.message || err.message || "Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <PlusCircle className="h-6 w-6 mr-2 text-green-600" /> Create New Service
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service ID */}
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
            Service ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="serviceId"
            name="serviceId"
            value={serviceId}
            onChange={handleServiceIdChange}
            maxLength={3} // HTML maxLength for basic client-side enforcement
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
            placeholder="e.g., PLM, ELE"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Only capital letters, max 3 characters.
          </p>
        </div>

        {/* Service Name */}
        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={serviceName}
            onChange={handleServiceNameChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Plumbing, Electrical"
            required
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
            <XCircle className="h-4 w-4 mr-2" /> Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> {loading ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateService;