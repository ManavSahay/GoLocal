import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Award,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  ArrowLeft,
  Camera,
  Users,
  ThumbsUp,
} from "lucide-react";

const ServiceProvider: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("about");
  const [showContactForm, setShowContactForm] = useState(false);

  // Mock data - in real app, fetch based on ID
  const provider = {
    id: 1,
    name: "John Kate",
    username: "JK_Music",
    category: "Personal Music Tutor",
    location: "Siruseri, Chennai-630032",
    rating: 4.8,
    reviews: 127,
    experience: "3yrs",
    phone: "+918934567827",
    email: "johnkate@gmail.com",
    image:
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
    verified: true,
    available: true,
    price: "₹500/hour",
    completedJobs: 10,
    description:
      "Hey, I am a painter providing painting services. I have 3 years of experience in residential and commercial painting. I specialize in interior and exterior painting with high-quality materials.",
    skills: [
      "Interior Painting",
      "Exterior Painting",
      "Wall Texturing",
      "Color Consultation",
    ],
    gallery: [
      "https://images.pexels.com/photos/5691656/pexels-photo-5691656.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300",
    ],
  };

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent painting work! John was professional, punctual, and delivered high-quality results. Highly recommended!",
      avatar:
        "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "1 month ago",
      comment:
        "Great attention to detail and very reasonable pricing. The work was completed on time and exceeded expectations.",
      avatar:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: 3,
      name: "Emily Davis",
      rating: 4,
      date: "2 months ago",
      comment:
        "Good quality work and professional service. Would definitely hire again for future projects.",
      avatar:
        "https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/services"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Provider Header */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                  {provider.verified && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-2 -right-2 ${
                      provider.available ? "bg-green-500" : "bg-red-500"
                    } text-white px-2 py-1 rounded-full text-xs font-medium`}
                  >
                    {provider.available ? "Available" : "Busy"}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {provider.name}
                    </h1>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      @{provider.username}
                    </span>
                  </div>

                  <p className="text-xl text-blue-600 font-medium mb-2">
                    {provider.category}
                  </p>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium text-gray-900">
                        {provider.rating}
                      </span>
                      <span className="ml-1 text-gray-500">
                        ({provider.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Experience: {provider.experience}
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {provider.completedJobs} jobs completed
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8">
                  {[
                    { id: "about", label: "About" },
                    { id: "gallery", label: "Gallery" },
                    { id: "reviews", label: "Reviews" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About Myself
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {provider.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Skills & Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Work Statistics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {provider.completedJobs}
                          </div>
                          <div className="text-sm text-gray-600">
                            Completed Jobs
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {provider.rating}
                          </div>
                          <div className="text-sm text-gray-600">
                            Average Rating
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {provider.reviews}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Reviews
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            100%
                          </div>
                          <div className="text-sm text-gray-600">
                            Success Rate
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "gallery" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Work Gallery
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {provider.gallery.map((image, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                        >
                          <img
                            src={image}
                            alt={`Work ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-medium">
                          {provider.rating} out of 5
                        </span>
                        <span className="text-gray-500">
                          ({provider.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 pb-6 last:border-b-0"
                        >
                          <div className="flex items-start space-x-4">
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">
                                  {review.name}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {review.date}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-yellow-400 fill-current"
                                  />
                                ))}
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                              <div className="flex items-center space-x-4 mt-3">
                                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>Helpful</span>
                                </button>
                                <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {provider.price}
                </div>
                <p className="text-gray-600">Starting price</p>
              </div>

              <div className="space-y-4 mb-6">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Contact Now
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Schedule Meeting
                </button>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{provider.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{provider.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{provider.location}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium">Within 1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repeat Customers</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-time Delivery</span>
                    <span className="font-medium">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact {provider.name}</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Phone
                </label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your requirements..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProvider;
