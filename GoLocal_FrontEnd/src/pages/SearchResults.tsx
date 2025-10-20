import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Filter,
  Star,
  Clock,
  Phone,
  Mail,
  Grid,
  List,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";

  // Mock search results
  const searchResults = [
    {
      id: 1,
      name: "Asray Painting Services",
      category: "Painting",
      rating: 4.8,
      reviews: 127,
      location: "Chennai",
      price: "₹500/hour",
      image:
        "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Professional painting services for residential and commercial properties. Specializing in interior and exterior painting.",
      experience: "5+ years",
      verified: true,
      available: true,
      distance: "2.5 km away",
    },
    {
      id: 2,
      name: "Quick Fix Plumbing",
      category: "Plumbing",
      rating: 4.7,
      reviews: 156,
      location: "Chennai",
      price: "₹600/hour",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Fast and reliable plumbing services for homes and offices. Emergency repairs available 24/7.",
      experience: "6+ years",
      verified: true,
      available: true,
      distance: "1.8 km away",
    },
    {
      id: 3,
      name: "Chennai Electrical Works",
      category: "Electrical",
      rating: 4.9,
      reviews: 89,
      location: "Chennai",
      price: "₹800/hour",
      image:
        "https://images.pexels.com/photos/5691656/pexels-photo-5691656.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Licensed electricians for all your electrical needs and repairs. Safety certified and insured.",
      experience: "8+ years",
      verified: true,
      available: false,
      distance: "3.2 km away",
    },
    {
      id: 4,
      name: "Home Clean Pro",
      category: "Cleaning",
      rating: 4.6,
      reviews: 203,
      location: "Chennai",
      price: "₹400/hour",
      image:
        "https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Professional house cleaning and organizing services. Eco-friendly products and trained staff.",
      experience: "4+ years",
      verified: true,
      available: true,
      distance: "4.1 km away",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 mb-4">
            <div className="flex-1 flex items-center">
              <Search className="h-5 w-5 text-gray-400 ml-4" />
              <input
                type="text"
                defaultValue={query}
                placeholder="What service do you need?"
                className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-700"
              />
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex-1 flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 ml-4" />
              <input
                type="text"
                defaultValue={location}
                placeholder="Enter your location"
                className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-700"
              />
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full mr-1 hover:from-blue-700 hover:to-purple-700 transition-all">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Results Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Results for "${query}"` : "Search Results"}
              </h1>
              <p className="text-gray-600">
                Found {searchResults.length} services
                {location && ` in ${location}`}
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="distance">Sort by Distance</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="space-y-2">
                      {[
                        "All",
                        "Painting",
                        "Plumbing",
                        "Electrical",
                        "Cleaning",
                        "Gardening",
                      ].map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Any Price</option>
                      <option>Under ₹500</option>
                      <option>₹500 - ₹800</option>
                      <option>Over ₹800</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="space-y-2">
                      {["4+ Stars", "4.5+ Stars", "5 Stars"].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            {rating}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Any Distance</option>
                      <option>Within 1 km</option>
                      <option>Within 5 km</option>
                      <option>Within 10 km</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Available Now
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Verified Only
                        </span>
                      </label>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:w-3/4" : "w-full"}>
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {searchResults.map((service) => (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div
                    className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-48"}`}
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {service.verified && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </div>
                    )}
                    <div
                      className={`absolute bottom-3 left-3 ${
                        service.available ? "bg-green-500" : "bg-red-500"
                      } text-white px-2 py-1 rounded-full text-xs font-medium`}
                    >
                      {service.available ? "Available" : "Busy"}
                    </div>
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {service.distance}
                    </div>
                  </div>

                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                      <span className="text-lg font-bold text-blue-600">
                        {service.price}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{service.description}</p>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {service.rating}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({service.reviews})
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {service.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.experience} experience
                      </div>
                      <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/provider/${service.id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View Profile
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Load More Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
