import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Filter,
  Grid,
  List,
  ChevronDown,
  Heart,
  Share2,
  Lock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFilters } from "../contexts/FilterContext";

const Services: React.FC = () => {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated } = useAuth();
  const { filters, updateFilter, applyFilters } = useFilters();

  const services = [
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
        "Professional painting services for residential and commercial properties.",
      experience: "5+ years",
      verified: true,
      available: true,
    },
    {
      id: 2,
      name: "Chennai Electrical Works",
      category: "Electrical",
      rating: 4.9,
      reviews: 89,
      location: "Chennai",
      price: "₹800/hour",
      image:
        "https://images.pexels.com/photos/5691656/pexels-photo-5691656.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Licensed electricians for all your electrical needs and repairs.",
      experience: "8+ years",
      verified: true,
      available: true,
    },
    {
      id: 3,
      name: "Quick Fix Plumbing",
      category: "Plumbing",
      rating: 4.7,
      reviews: 156,
      location: "Chennai",
      price: "₹600/hour",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Fast and reliable plumbing services for homes and offices.",
      experience: "6+ years",
      verified: true,
      available: false,
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
      description: "Professional house cleaning and organizing services.",
      experience: "4+ years",
      verified: true,
      available: true,
    },
    {
      id: 5,
      name: "Garden Care Experts",
      category: "Gardening",
      rating: 4.8,
      reviews: 94,
      location: "Chennai",
      price: "₹350/hour",
      image:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Complete garden maintenance and landscaping services.",
      experience: "7+ years",
      verified: true,
      available: true,
    },
    {
      id: 6,
      name: "Tech Repair Hub",
      category: "Technology",
      rating: 4.9,
      reviews: 78,
      location: "Chennai",
      price: "₹700/hour",
      image:
        "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Computer and mobile device repair specialists.",
      experience: "5+ years",
      verified: true,
      available: true,
    },
  ];

  const categories = [
    "All Services",
    "Painting",
    "Electrical",
    "Plumbing",
    "Cleaning",
    "Gardening",
    "Technology",
  ];

  // Apply category filter from URL
  React.useEffect(() => {
    if (category && filters.category !== category.replace("-", " ")) {
      updateFilter("category", category.replace("-", " "));
    } else if (!category && filters.category) {
      updateFilter("category", "");
    }
  }, [category, updateFilter, filters.category]);

  // Apply all filters
  const filteredServices = applyFilters(services);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category
                  ? category
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                  : "All Services"}
              </h1>
              <p className="text-gray-600 mt-1">
                Found {filteredServices.length} services in Chennai
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
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="reviews">Sort by Reviews</option>
                  <option value="experience">Sort by Experience</option>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32 z-[10]">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={
                      cat === "All Services"
                        ? "/services"
                        : `/services/${cat.toLowerCase().replace(" ", "-")}`
                    }
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      (cat === "All Services" && !category) ||
                      (category &&
                        cat.toLowerCase().replace(" ", "-") === category)
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>

              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Filters</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select
                        value={filters.priceRange}
                        onChange={(e) =>
                          updateFilter("priceRange", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Any Price</option>
                        <option value="Under ₹500">Under ₹500</option>
                        <option value="₹500 - ₹800">₹500 - ₹800</option>
                        <option value="Over ₹800">Over ₹800</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <select
                        value={filters.rating}
                        onChange={(e) => updateFilter("rating", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Any Rating</option>
                        <option value="4+ Stars">4+ Stars</option>
                        <option value="4.5+ Stars">4.5+ Stars</option>
                        <option value="5 Stars">5 Stars</option>
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
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services Grid/List */}
          <div className="lg:w-3/4 relative">
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredServices.map((service) => (
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
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
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
                          ({service.reviews} reviews)
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

                      {isAuthenticated ? (
                        <>
                          <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Call Provider"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                          <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Email Provider"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                            title="Login to view contact details"
                          >
                            <Lock className="h-4 w-4" />
                            <Phone className="h-4 w-4" />
                          </Link>
                          <Link
                            to="/login"
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                            title="Login to view contact details"
                          >
                            <Lock className="h-4 w-4" />
                            <Mail className="h-4 w-4" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Load More Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
