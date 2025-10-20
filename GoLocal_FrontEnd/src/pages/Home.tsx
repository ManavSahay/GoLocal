// src/pages/Home.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Home as HomeIcon,
  Car,
  Paintbrush,
  Star,
  Users,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Zap,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
  Target, // Not used but was in your original import
  Globe,
} from "lucide-react";
import PremiumSearchBar from "../components/PremiumSearchBar";
// import { useAuth, LoadingSpinner } from "../contexts/AuthContext";
// import ErrorMessage from "../components/Common/ErrorMessage";

// Import the ServicePage component
import { Provider } from "../components/exportTypes";
import ServicePage from "./ServicePage"; // Adjust path based on your file structure
import axios from "axios";
// Service interface is now only needed by ServicePage itself
// Unless Home component explicitly needs to deal with service types for other sections,
// you can remove it from here. I'll keep it commented out for clarity.
// interface Service {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl?: string;
// }

const Home: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Provider[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
 
  // You no longer need to fetch backendServices directly in Home if ServicePage handles it.
  // const { getAllServices } = useAuth(); // No longer directly used here for service fetching
  // const [backendServices, setBackendServices] = useState<Service[]>([]); // No longer needed
  // const [servicesLoading, setServicesLoading] = useState(true); // No longer needed
  // const [servicesError, setServicesError] = useState<string | null>(null); // No longer needed

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment:
        "Found an amazing electrician through Go Local. Professional service and fair pricing! The platform made it so easy to connect with local professionals.",
      service: "Electrical Work",
      image:
        "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150",
      location: "Chennai",
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment:
        "Quick response time and excellent quality work. The search feature helped me find exactly what I needed in my neighborhood.",
      service: "Plumbing",
      image:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150",
      location: "Mumbai",
    },
    {
      name: "Anita Patel",
      rating: 5,
      comment:
        "Great experience from start to finish. The helper was punctual and did exceptional work. Go Local is my go-to platform now!",
      service: "Home Cleaning",
      image:
        "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=150",
      location: "Bangalore",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "25,000+",
      label: "Happy Customers",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: CheckCircle,
      value: "75,000+",
      label: "Jobs Completed",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Award,
      value: "8,000+",
      label: "Verified Providers",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description:
        "All service providers are thoroughly vetted and background-checked for your safety and peace of mind.",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Clock,
      title: "Quick Response",
      description:
        "Get connected with available professionals in your area within minutes, not hours.",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description:
        "Our rating system and reviews ensure you always get the best service quality.",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      icon: MapPin,
      title: "Local Focus",
      description:
        "Support your local community by connecting with neighborhood professionals.",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  // Remove the fetchBackendServices useCallback as ServicePage will handle its own fetching.
  // const fetchBackendServices = useCallback(async () => { /* ... */ }, [getAllServices]);

  useEffect(() => {
    setIsVisible(true);
    // Removed fetchBackendServices() call from here

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]); // Dependencies adjusted

  // Removed getServiceIcon, getServiceColor, getServiceImage helpers
  // as ServicePage will handle its own rendering logic now.

  // Removed loading and error checks for services here, as ServicePage will handle them internally.
  // if (servicesLoading) { /* ... */ }
  const handleSearch = async (location: string, serviceType: string) => {
    setSearchResults([]);
    setSearchError(null);
    setLoadingSearch(true);
 
    try {
      const trimmedLocation = location.trim();
      const trimmedServiceType = serviceType.trim();
 
      if (!trimmedLocation && !trimmedServiceType) {
        setSearchError("Please enter a location or a service to search.");
        setLoadingSearch(false);
        return;
      }
 
      let url: string;
 
      if (trimmedLocation && trimmedServiceType) {
        url = `http://localhost:8080/api/search/search-relevant/${trimmedLocation}/${trimmedServiceType}`;
      } else if (trimmedLocation) {
        url = `http://localhost:8080/api/search/search-by-location/${trimmedLocation}`;
      } else {
        url = `http://localhost:8080/api/search/search-by-service/${trimmedServiceType}`;
      }
 
      console.log("Fetching URL:", url);
 
      const response = await axios.get<Provider[]>(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
 
      console.log("API response data before decoding:", response.data);
 
      const decodedProviders = response.data.map(provider => ({
        ...provider,
       
      }));
 
      console.log("API response data after decoding:", decodedProviders);
 
 
      if (decodedProviders.length === 0) {
        setSearchError("No professionals found for your search criteria.");
      }
      setSearchResults(decodedProviders);
 
    } catch (err: any) {
      console.error("Error during search:", err);
      let errorMessage = "Failed to fetch search results.";
 
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 404) {
          errorMessage = err.response.data || "No professionals found for your search criteria.";
        } else if (err.response.data && (typeof err.response.data === 'string' || err.response.data.message)) {
          errorMessage = typeof err.response.data === 'string' ? err.response.data : err.response.data.message;
        } else {
          errorMessage = `Error: ${err.response.status} - ${err.response.statusText || 'Unknown error'}`;
        }
      } else {
        errorMessage = err.message || "A network error occurred. Please check your connection.";
      }
      setSearchError(errorMessage);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };
 
 
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 text-white py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full animate-float"></div>
          <div
            className="absolute top-40 right-32 w-24 h-24 bg-yellow-400 opacity-20 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-20 h-20 bg-pink-400 opacity-15 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-300 opacity-20 rounded-full animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "animate-slide-down" : "opacity-0"
              }`}
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                Find Local
                <span className="block text-gradient text-glow typing-animation">
                  Professionals
                </span>
              </h1>

              <p className="text-2xl mb-12 text-orange-100 leading-relaxed max-w-4xl mx-auto">
                Connect with skilled professionals in your neighborhood. From
                home repairs to personal services, discover trusted local
                experts who care about your community.
              </p>
            </div>

            {/* Premium Search Bar */}
            <div
              className={`mb-16 transition-all duration-1000 delay-300 relative z-[50] ${
                isVisible ? "animate-slide-up" : "opacity-0"
              }`}
            >
              <PremiumSearchBar onSearch={handleSearch}/>
              {/* Display Loading, Search Results or Error */}
            {loadingSearch && (
              <div className="flex justify-center items-center py-8 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white-500"></div>
                <p className="ml-4 text-xl">Searching for professionals...</p>
              </div>
            )}
 
            {!loadingSearch && searchError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8 animate-fade-in" role="alert">
                {/* <AlertTriangle className="inline w-5 h-5 mr-2" /> */}
                <span className="block sm:inline ml-2">{searchError}</span>
              </div>
            )}
 
            {!loadingSearch && searchResults.length > 0 ? (
              <div className="mt-8 mb-16 text-left bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 shadow-xl animate-fade-in">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Search Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((provider) => (
                    <div key={provider.username} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                      <div className="p-6">
                        {/* Profile Picture */}
                        {provider.profilePicture && (
                          <div className="mb-4 flex justify-center">
                            <img
                              src={`data:image/jpeg;base64,${provider.profilePicture}`}
                              alt={`${provider.providerName}'s profile`}
                              className="w-24 h-24 rounded-full object-cover border-2 border-orange-500"
                            />
                          </div>
                        )}
 
                        {/* Provider Name */}
                        <h4 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                          {/* <User className="h-5 w-5 mr-2 text-blue-600" /> */}
                          {provider.providerName}
                        </h4>
 
                        {/* Username (Provider ID) */}
                        <p className="text-gray-600 text-sm mb-2 flex items-center">
                          {/* <User className="inline-block h-4 w-4 mr-1 text-gray-500" /> */}
                          <span className="font-medium">Username:</span> {provider.username}
                        </p>
 
                        {/* Service Type */}
                        <p className="text-gray-600 mb-1 flex items-center">
                          <Wrench className="inline-block h-4 w-4 mr-1 text-purple-500" />
                          Service: {provider.service?.serviceName || 'N/A'}
                        </p>
 
                        {/* Location */}
                        <p className="text-gray-600 mb-1 flex items-center">
                          <MapPin className="inline-block h-4 w-4 mr-1 text-blue-500" />
                          Location: {provider.location}
                        </p>
 
                        {/* Rating */}
                        
 
                        {/* Experience */}
                        <p className="text-gray-600 mb-1 flex items-center">
                          
                          Experience: {provider.experience} years
                        </p>
 
                        {/* Mobile Number */}
                        <p className="text-gray-600 mb-1 flex items-center">
                          
                          Mobile: {provider.mobileNumber}
                        </p>
 
                        {/* Email */}
                        <p className="text-gray-600 mb-1 flex items-center">
                          {/* <Mail className="inline-block h-4 w-4 mr-1 text-red-500" /> */}
                          Email: {provider.email}
                        </p>
 
                        {/* Number of Times Booked */}
                        <p className="text-gray-600 mb-1 flex items-center">
                            {/* <BookOpen className="inline-block h-4 w-4 mr-1 text-orange-500" /> */}
                            Booked {provider.noOfTimesBooked} times
                        </p>
 
                       
                        {/* View Profile Link */}
                        <Link
                          to={`/services/${provider.username}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mt-4"
                        >
                          View Profile
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !loadingSearch && !searchError && (
                <div className="mt-8 mb-16 text-white text-xl animate-fade-in">
                  Start by searching for a service or location above!
                </div>
              )
            )}
            </div>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-500 ${
                isVisible ? "animate-zoom-in" : "opacity-0"
              }`}
            >
              <Link
                to="/services"
                className="group bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-premium flex items-center justify-center"
              >
                Find Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/signup/provider"
                className="group border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Zap className="mr-2 h-5 w-5" />
                Become a Provider
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-orange-200">
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-green-300" />
                <span className="font-semibold">100% Verified</span>
              </div>
              <div className="flex items-center">
                <Star className="h-6 w-6 mr-2 text-yellow-300" />
                <span className="font-semibold">4.9★ Rating</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-2 text-purple-300" />
                <span className="font-semibold">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group scroll-reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 ${stat.bg} rounded-3xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-glow`}
                >
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Directly render the ServicePage component here */}
      {/* This will make the entire ServicePage appear within the Home page */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <ServicePage />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Choose Go Local?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to connecting you with the best local
              professionals while supporting your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group card-glow bg-white rounded-3xl p-8 shadow-premium hover-lift"
              >
                <div
                  className={`w-24 h-24 ${feature.bg} rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-12 w-12 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Real reviews from satisfied customers in your neighborhood
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-3xl shadow-premium p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="h-8 w-8 text-yellow-400 fill-current"
                    />
                  )
                )}
              </div>

              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].comment}"
              </blockquote>

              <div className="flex items-center justify-center">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].service} •{" "}
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white opacity-5 rounded-full animate-float"></div>
          <div
            className="absolute bottom-20 left-20 w-32 h-32 bg-yellow-400 opacity-10 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Ready to Go Local?
          </h2>
          <p className="text-2xl mb-12 text-orange-100 leading-relaxed">
            Join thousands of satisfied customers and professional service
            providers in your community today
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              to="/services"
              className="group bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-premium flex items-center justify-center"
            >
              Find Local Services
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/signup/provider"
              className="group border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Earning Today
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-orange-200">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span className="font-semibold">Free to Join</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              <span className="font-semibold">Verified Professionals</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              <span className="font-semibold">Local Impact</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;