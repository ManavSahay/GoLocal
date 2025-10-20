// src/components/SearchCustomer.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, User } from 'lucide-react'; // Added User icon for visual
import { Customer } from './exportTypes'; // Import the Customer type

interface SearchCustomerProps {
  onCustomerFound: (customer: Customer | null) => void; // Callback with found customer or null
  onSearchError: (error: string | null) => void; // Callback for search errors
  // Optional: A way to signal if search is active/inactive
  onSearchActiveChange: (isActive: boolean) => void;
}

const SearchCustomer: React.FC<SearchCustomerProps> = ({ onCustomerFound, onSearchError, onSearchActiveChange }) => {
  const [customerId, setCustomerId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerId(e.target.value);
    // Clear previous search results and errors when user types
    onCustomerFound(null);
    onSearchError(null);
    onSearchActiveChange(e.target.value.trim() !== ''); // Indicate search is active if there's a term
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim()) {
      onSearchError("Please enter a username or customer name to search.");
      onCustomerFound(null);
      onSearchActiveChange(false);
      return;
    }

    setLoading(true);
    onSearchError(null); // Clear previous errors
    onCustomerFound(null); // Clear previous results

    try {
      // Assuming your backend has an endpoint like '/api/admin/customers/search?query=...'
      // or '/api/admin/get-customer-by-username/{username}'
      // For simplicity, let's use a username-based search as it's more specific.
      // You might need to adjust the API endpoint based on your actual backend.
      const response = await axios.get<Customer>(
        `http://localhost:8080/api/admin/get-customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      onCustomerFound(response.data);
      onSearchActiveChange(true); // Search was performed
    } catch (err: any) {
      console.error("Error searching customer:", err);
      if (err.response && err.response.status === 404) {
        onSearchError(`No customer found with username/name: '${customerId}'`);
      } else {
        onSearchError(err.response?.data?.message || err.message || "Failed to search customer.");
      }
      onCustomerFound(null); // Ensure no old data is shown
      onSearchActiveChange(false); // Search failed or no result
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg shadow-sm mb-4">
      <form onSubmit={handleSearchSubmit} className="flex flex-grow items-center space-x-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search customer by username..."
            value={customerId}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchCustomer;