import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import {Service, GetAllServicesResponse} from "../types/service.d"; // Use the main Service interface from types

// Remove the local Service interface here as it's now imported from types/service
// interface Service {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl?: string;
// }

const ServicePage: React.FC = () => {
  
  const { getAllServices } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedData: Service[] | null = await getAllServices();

        if (fetchedData) {
          console.log("Original fetched data:", fetchedData);

          // Map backend property names to frontend 'Service' interface properties
          const mappedServices: Service[] = fetchedData.map((backendService: any) => ({
            // serviceId: backendService.service.serviceId,
            // serviceName: backendService.service.serviceName,
            description: backendService.description || "No description available.",
            profilePicture: backendService.profilePicture,
            // Ensure these properties are mapped if your backend provides them,
            // as they will be needed for the ServiceDetailPage and BookingForm
            // price: backendService.price, // Assuming your backend has a price field
            providerId: backendService.username, // Assuming your backend has a providerId field
            providerName: backendService.providerName, // Assuming your backend has a providerName field
            providerRating: backendService.rating,
            location:backendService.location,
            mobileNumber:backendService.mobileNumber,
            service:backendService.service,
            email:backendService.email,
            noOfTimesBooked:backendService.noOfTimesBooked,
            experience:backendService.experience,
            noOfBookings:backendService.noOfBookings,
            username:backendService.username,
            role:"ROLE_PROVIDER",
            isDeleted:false

             // Assuming your backend has a rating field
          }));

          console.log("Mapped services for display and detail:", mappedServices);
          setServices(mappedServices);
        } else {
          setServices([]);
          setError("No services found.");
        }
      } catch (err) {
        console.error("Failed to fetch all services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [getAllServices]);

  // Handler for clicking a service card, navigating to the Service Detail Page
  const handleViewDetails = (username: string) => {
    navigate(`/services/${username}`); // Navigate to the dedicated service detail page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-12 min-h-screen">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
        All Our Services
      </h1>

      {services.length === 0 ? (
        <p className="text-center text-xl text-gray-600">
          No services are available at the moment. Please check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.username}
              onClick={() => handleViewDetails(service.username)} // Click entire card to view details
              className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
            >
              {service.profilePicture && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${service.profilePicture}`}
                    alt={service.providerName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute bottom-4 left-4 text-white text-lg font-bold">
                    {service.username}
                  </span>
                </div>
              )}
              {!service.profilePicture && (
                <div className="p-6 pb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                    {service.providerName}
                  </h2>
                </div>
              )}

              <div className="p-6 pt-0">
                <h3 className="text-gray-600 font-semibold leading-relaxed line-clamp-3">
                {service.service.serviceId}-{service.service.serviceName}
                </h3>
                <div className="mt-4 flex items-center justify-between text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>View Details</span> {/* Simplified to single action per card */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicePage;