// src/components/SearchService.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Services } from './exportTypes'; // Import the Services type

interface SearchServiceProps {
  onServiceFound: (service: Services | null) => void;
  onSearchError: (error: string | null) => void;
  onSearchActiveChange: (isActive: boolean) => void;
  onClearSearch: () => void; // New prop to handle clearing the search
}

const SearchService: React.FC<SearchServiceProps> = ({ onServiceFound, onSearchError, onSearchActiveChange, onClearSearch }) => {
  const [serviceId, setServiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Ensure uppercase as per validation
    setServiceId(value);
    if (localError) setLocalError(null); // Clear local error on input change
    onSearchActiveChange(false); // Indicate search is not active until button is clicked
    onServiceFound(null); // Clear previous search results in parent
    onSearchError(null); // Clear parent error
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    onSearchError(null); // Clear parent error before new search
    onServiceFound(null); // Clear previous service data
    onSearchActiveChange(true); // Indicate that a search is active

    // Basic client-side validation for serviceId format
    if (!serviceId || serviceId.length === 0) {
      setLocalError("Please enter a Service ID to search.");
      setLoading(false);
      onSearchActiveChange(false);
      return;
    }
    if (!/^[A-Z]{1,3}$/.test(serviceId)) {
        setLocalError("Service ID must be 1 to 3 capital letters.");
        setLoading(false);
        onSearchActiveChange(false);
        return;
    }

    try {
      const response = await axios.get<Services>(
        `http://localhost:8080/api/admin/get-service/${serviceId}`, // Adjust this API endpoint
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data) {
        onServiceFound(response.data); // Pass found service to parent
      } else {
        onServiceFound(null);
        onSearchError("Service not found.");
      }
    } catch (err: any) {
      console.error("Error searching service:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to search service.";
      setLocalError(errorMessage);
      onSearchError(errorMessage); // Pass error to parent
      onServiceFound(null); // Ensure no old data is displayed
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setServiceId('');
    setLocalError(null);
    setLoading(false);
    onClearSearch(); // Call parent's clear function
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Search className="h-5 w-5 mr-2 text-blue-600" /> Search Service
      </h3>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-grow w-full sm:w-auto">
          <label htmlFor="searchServiceId" className="block text-sm font-medium text-gray-700 sr-only">
            Service ID
          </label>
          <input
            type="text"
            id="searchServiceId"
            name="searchServiceId"
            value={serviceId}
            onChange={handleInputChange}
            maxLength={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
            placeholder="Enter Service ID (e.g., PLM)"
          />
        </div>
        <div className="flex space-x-2 w-full sm:w-auto justify-end">
          <button
            type="submit"
            disabled={loading || !serviceId}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <XCircle className="h-4 w-4 mr-2" /> Clear
          </button>
        </div>
      </form>
      {localError && (
        <div className="mt-4 p-3 flex items-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <AlertTriangle className="flex-shrink-0 inline w-4 h-4 mr-3" />
          <div>{localError}</div>
        </div>
      )}
    </div>
  );
};

export default SearchService;