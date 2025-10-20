import React, { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || location.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`,
      );
    }
  };

  const popularServices = [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Painting",
    "Gardening",
    "Tutoring",
  ];

  return (
    <div className="w-full relative">
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-gray-50 rounded-full border border-gray-200 hover:border-blue-300 transition-colors"
      >
        <div className="flex-1 flex items-center">
          <Search className="h-5 w-5 text-gray-400 ml-4" />
          <input
            type="text"
            placeholder="What service do you need?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
          />
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        <div className="flex-1 flex items-center">
          <MapPin className="h-5 w-5 text-gray-400 ml-4" />
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="p-3 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <Filter className="h-5 w-5" />
        </button>

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full mr-1 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {/* Popular Services */}
      <div className="mt-2 flex flex-wrap gap-2">
        {popularServices.map((service) => (
          <button
            key={service}
            onClick={() => {
              setSearchQuery(service);
              navigate(
                `/search?q=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`,
              );
            }}
            className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            {service}
          </button>
        ))}
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[150] animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Any Price</option>
                <option>Under $50</option>
                <option>$50 - $100</option>
                <option>$100 - $200</option>
                <option>Over $200</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Any Rating</option>
                <option>4+ Stars</option>
                <option>4.5+ Stars</option>
                <option>5 Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Any Time</option>
                <option>Available Today</option>
                <option>Available This Week</option>
                <option>Available This Month</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
