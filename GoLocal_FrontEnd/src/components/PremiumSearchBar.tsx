import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
} from "lucide-react"; // Removed TrendingUp and Loader2 as they are no longer needed
import { useFilters } from "../contexts/FilterContext"; // Ensure this path is correct
 
// Define the props for PremiumSearchBar
interface PremiumSearchBarProps {
  onSearch: (location: string, serviceType: string) => void; // Function to trigger the actual search API call
}
 
const PremiumSearchBar: React.FC<PremiumSearchBarProps> = ({ onSearch }) => {
  // Removed showSuggestions, trendingServices, loadingTrending, errorTrending states
  // Removed the fetchTrendingServices useEffect hook
  const { filters, updateFilter } = useFilters(); // Using your context for filters
 
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only trigger search if at least one field has non-empty content
    if (filters.location.trim() || filters.search.trim()) {
      onSearch(filters.location, filters.search);
    } else {
      console.warn("Search initiated with empty fields. No API call made. Clearing results.");
      // Call onSearch with empty strings to explicitly tell Home to clear results
      // and display the initial "Start by searching" message.
      onSearch('', '');
    }
  };
 
  return (
    <div className="w-full max-w-4xl mx-auto relative dropdown-container">
      {/* Main Search Container */}
      <div className="search-premium rounded-3xl p-2 shadow-premium">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          {/* Service Search Input */}
          <div className="flex-1 flex items-center px-4">
            <Search className="h-6 w-6 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="What service do you need?"
              value={filters.search}
              onChange={(e) => {
                updateFilter("search", e.target.value);
                // No need to setShowSuggestions(true) or false now
              }}
              onClick={(e) => {
                // No need to setShowSuggestions(true) or stopPropagation now
              }}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-700 placeholder-gray-500 font-medium"
            />
          </div>
 
          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>
 
          {/* Location Search Input */}
          <div className="flex-1 flex items-center px-4">
            <MapPin className="h-6 w-6 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Enter your location"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-700 placeholder-gray-500 font-medium"
            />
          </div>
 
          {/* Search Button */}
          <button
            type="submit"
            className="btn-premium text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-glow hover-lift"
          >
            Search
          </button>
        </form>
      </div>
 
      {/* The entire "Trending Services Suggestions" block has been removed from here */}
 
    </div>
  );
};
 
export default PremiumSearchBar;
 