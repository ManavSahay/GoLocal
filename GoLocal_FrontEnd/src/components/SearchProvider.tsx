// src/components/SearchProvider.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle } from 'lucide-react';
import { Provider } from './exportTypes'; // Ensure Provider type is imported

interface SearchProviderProps {
    onProviderFound: (provider: Provider | null) => void;
    onSearchError: (error: string | null) => void;
    onSearchActiveChange: (isActive: boolean) => void;
}

const SearchProvider: React.FC<SearchProviderProps> = ({
    onProviderFound,
    onSearchError,
    onSearchActiveChange,
}) => {
    const [searchUsername, setSearchUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchUsername(value);
        onSearchActiveChange(value.trim() !== ''); // Set search active if input is not empty
        if (value.trim() === '') {
            onProviderFound(null); // Clear found provider when search input is cleared
            onSearchError(null); // Clear any errors
        }
    };

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchUsername.trim()) {
            onSearchError('Please enter a username to search for a provider.');
            onProviderFound(null);
            return;
        }

        setLoading(true);
        onSearchError(null); // Clear previous errors
        onProviderFound(null); // Clear previous results

        try {
            const response = await axios.get<Provider>(
                `http://localhost:8080/api/admin/get-providers/${searchUsername.trim()}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            onProviderFound(response.data);
        } catch (err: any) {
            console.error("Error searching for provider:", err);
            if (err.response && err.response.status === 404) {
                onSearchError(`Provider with username '${searchUsername}' not found.`);
            } else {
                onSearchError(err.response?.data?.message || "Failed to search for provider. Please try again.");
            }
            onProviderFound(null);
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
                        placeholder="Search provider by username..."
                        value={searchUsername}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />

                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
        </div>
    );
};

export default SearchProvider;