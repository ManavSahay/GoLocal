// src/pages/ServiceDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import BookServiceForm from '../components/CustomerDashboard/BookServiceForm';
import { Service } from '../types/service.d';
import { MapPin, Star, Phone, Mail, Clock, Info, Briefcase, DollarSign } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const ServiceDetailPage: React.FC = () => {
    const { username } = useParams<{ username: string }>(); // username can be string | undefined
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [providerDetails, setProviderDetails] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);

    useEffect(() => {
        const fetchProviderDetails = async () => {
            // IMPORTANT: Add this check here!
            if (!username) {
                console.warn("Username is undefined, cannot fetch provider details.");
                setError("Provider username not found in URL. Please go back and select a provider.");
                setLoading(false);
                return; // Exit early if username is not available
            }

            setLoading(true);
            setError(null);
            setProviderDetails(null);

            try {
                const response = await axios.get<Service>(`${API_BASE_URL}/auth/get-profile/${username}`);
                setProviderDetails(response.data);
                console.log("Fetched Provider Details:", response.data);

            } catch (err) {
                console.error("Error fetching provider details:", err);
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 404) {
                        setError(`Provider with username "${username}" not found.`);
                    } else {
                        setError(`Could not load provider details: ${err.response.data.message || err.message}.`);
                    }
                } else {
                    setError("Could not load provider details. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProviderDetails();
    }, [username]); // The effect re-runs when 'username' changes (from undefined to a string)

    const handleBookingClick = () => {
        if (!isAuthenticated || user?.role !== 'ROLE_CUSTOMER') {
            alert('Please log in as a customer to book a service.');
            return;
        }
        setShowBookingForm(true);
    };

    const handleBookingSuccess = () => {
        alert("Booking request sent successfully!");
        setShowBookingForm(false);
        navigate('/customer-dashboard');
    };

    // ... (rest of your component rendering logic remains largely the same)
    // Make sure to handle the case where providerDetails is null or undefined for rendering
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner message="Loading provider details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-24 text-center">
                <ErrorMessage message={error} />
                <button
                    onClick={() => navigate('/services')}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition duration-200"
                >
                    Back to All Services
                </button>
            </div>
        );
    }

    if (!providerDetails) { // Also handles the initial 'undefined' username case
        return (
            <div className="py-24 text-center text-gray-700">
                <p>Provider details could not be loaded. Please check the URL or try again.</p>
                <button
                    onClick={() => navigate('/services')}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition duration-200"
                >
                    Back to All Services
                </button>
            </div>
        );
    }

    // Destructure providerDetails for easier access
    const {
        username: providerUsername,
        providerName,
        profilePicture,
        rating,
        description,
        location,
        mobileNumber,
        email,
        experience,
        noOfBookings,
        service // Assuming this is a single service object provided by this provider
    } = providerDetails;

    return (
        <div className="container mx-auto p-6 lg:p-12 min-h-screen">
            <h1 className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
                {providerName || providerUsername}'s Profile
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Provider Profile Picture */}
                <div className="flex-shrink-0">
                    {profilePicture ? (
                        <img
                            src={`data:image/jpeg;base64,${profilePicture}`} // Ensure this prefix is always present
                            alt={providerName || "Provider Profile"}
                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-200 shadow-md"
                        />
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-6xl font-bold border-4 border-blue-200 shadow-md">
                            {providerName ? providerName.charAt(0) : 'P'}
                        </div>
                    )}
                </div>

                {/* Provider Details */}
                <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {providerName || providerUsername}
                    </h2>
                    
                    {/* {description && (
                         <p className="text-gray-700 text-lg mb-4 leading-relaxed flex items-start">
                            <Info className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-1" />
                            <span>{description}</span>
                        </p>
                    )} */}

                    <div className="space-y-3 mt-4">
                        {rating !== undefined && rating !== null && (
                            <p className="text-gray-700 flex items-center">
                                <Star className="h-5 w-5 text-yellow-500 mr-2 fill-yellow-500" />
                                <span>Rating: {rating.toFixed(1)}/5</span>
                            </p>
                        )}
                        {location && (
                            <p className="text-gray-700 flex items-center">
                                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                                <span>Location: {location}</span>
                            </p>
                        )}
                        {mobileNumber && (
                            <p className="text-gray-700 flex items-center">
                                <Phone className="h-5 w-5 text-gray-500 mr-2" />
                                <span>Phone: {mobileNumber}</span>
                            </p>
                        )}
                        {email && (
                            <p className="text-gray-700 flex items-center">
                                <Mail className="h-5 w-5 text-gray-500 mr-2" />
                                <span>Email: {email}</span>
                            </p>
                        )}
                        {/* Removed availableFrom/To if they are not consistently available */}
                        {experience && (
                            <p className="text-gray-700 flex items-center">
                                <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                                <span>Experience: {experience} years</span>
                            </p>
                        )}
                        {noOfBookings !== undefined && noOfBookings !== null && (
                            <p className="text-gray-700 flex items-center">
                                <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                                <span>Bookings Completed: {noOfBookings}</span>
                            </p>
                        )}

                        {/* Display service ID from the nested 'service' object */}
                        {service?.serviceId && ( // Use optional chaining here
                        
                                
                                <p className="text-gray-700 flex items-center">
                                    <Info className="h-5 w-5 text-gray-500 mr-2" />
                                    <span>Service ID:{service.serviceId}</span></p>
                               
                         
                        )}
                        
                        {/* Display details of the primary service */}
                        {service && service.serviceName && (
                             <p className="text-gray-700 flex items-center">
                             <Info className="h-5 w-5 text-gray-500 mr-2" />
                             <span>Service Name:{service.serviceName}</span></p>
                        )}
                    </div>

                    {!showBookingForm ? (
                        <button
                            onClick={handleBookingClick}
                            className="mt-6 w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-md text-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                        >
                            Book This Provider
                        </button>
                    ) : (
                        <p className="text-center text-gray-600 mt-4">Fill the form below to book.</p>
                    )}
                </div>
            </div>

            {showBookingForm && providerDetails && (
                <div className="mt-8">
                    <BookServiceForm
                        initialProviderId={providerUsername}
                        // If BookServiceForm also needs the specific service ID to book, pass it like this:
                        // Pass the specific serviceId
                        // Pass the specific service name
                        onServiceBooked={handleBookingSuccess}
                    />
                    <button
                        onClick={() => setShowBookingForm(false)}
                        className="mt-4 w-full md:w-auto px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                        Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServiceDetailPage;