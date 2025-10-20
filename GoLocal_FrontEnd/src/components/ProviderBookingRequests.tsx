// // src/components/ProviderBookingRequests.tsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { CheckCircle, XCircle, Clock, Info, Star} from 'lucide-react';
// // import ProviderRatingCustomer from './ProviderRatingCustomer'; // No longer needed as it's merged
// import { Provider } from '../components/exportTypes'; // Ensure this path is correct for your Provider interface
 
// const API_BASE_URL = 'http://localhost:8080/api';
 
// // Interface for Customer as received from the backend
// interface Customer {
//     username: string;
//     customerName: string;
//     location: string;
//     mobileNumber: string; // Changed from BigInt as JSON numbers are typically represented as strings or numbers in JS
//     email: string;
//     rating: number; // Assuming this is an average rating from their bookings
//     profilePicture: string; // Assuming base64 encoded string or URL, not Uint8Array directly
//     noOfBookings: number;
// }
 
// // Interface for ServiceEntity as received from the backend
// interface ServiceEntity {
//     serviceId: string;
//     serviceName: string;
//     noOfProviders: number;
// }
 
// // Interface for Booking as received from the backend
// interface Booking {
//     bookingId: string;
//     provider: Provider;
//     customer: Customer;
//     location: string;
//     dateTime: string;
//     amountPaid: number;
//     service: ServiceEntity;
//     status: 'REQUESTED' | 'PENDING' | 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
//     rating?: any; // Added this to represent the presence of a rating object (or null)
// }
 
// const ProviderBookingRequests: React.FC = () => {
//     const [bookings, setBookings] = useState<Booking[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const providerUsername = localStorage.getItem('username');
 
//     // State for the Rating Modal
//     const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
//     const [currentBookingToRate, setCurrentBookingToRate] = useState<Booking | null>(null);
//     // States that were originally in ProviderRatingCustomer.tsx
//     const [ratingValue, setRatingValue] = useState(0); // Renamed to avoid conflict with `rating` in Booking interface
//     const [comment, setComment] = useState('');
//     const [submittingRating, setSubmittingRating] = useState(false); // Renamed to avoid conflict
//     const [ratingError, setRatingError] = useState<string | null>(null); // Renamed to avoid conflict
 
//     const fetchBookings = async () => {
//         if (!providerUsername) {
//             setError("Provider username not found. Cannot fetch bookings.");
//             setLoading(false);
//             return;
//         }
 
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await axios.get<Booking[]>(
//                 `${API_BASE_URL}/bookings/all-received-requests/${providerUsername}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 }
//             );
//             console.log("Full API Response Data:", res.data);
//             setBookings(res.data);
//         } catch (err: any) {
//             console.error('Failed to fetch bookings:', err.response?.data || err);
//             setError(err.response?.data?.message || 'Failed to load bookings. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
 
//     useEffect(() => {
//         fetchBookings();
//     }, [providerUsername]);
 
//     const handleUpdateBookingStatus = async (bookingId: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') => {
//         setLoading(true);
//         setError(null);
//         try {
//             let endpoint = '';
//             if (status === 'ACCEPTED') {
//                 endpoint = `${API_BASE_URL}/bookings/accept-request/${bookingId}`;
//             } else if (status === 'REJECTED') {
//                 endpoint = `${API_BASE_URL}/bookings/reject-request/${bookingId}`;
//             } else if (status === 'COMPLETED') {
//                 endpoint = `${API_BASE_URL}/bookings/complete/${bookingId}`;
//             } else {
//                 console.error("Invalid status for update:", status);
//                 setError("Invalid status update request.");
//                 setLoading(false);
//                 return;
//             }
 
//             await axios.put(endpoint, {}, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             await fetchBookings();
//             alert(`Booking ${bookingId} status updated to ${status}.`);
//         } catch (err: any) {
//             console.error(`Failed to update booking status for ${bookingId}:`, err.response?.data || err);
//             setError(err.response?.data?.message || `Failed to update status for booking ${bookingId}.`);
//         } finally {
//             setLoading(false);
//         }
//     };
 
//     // Handler to open the rating modal and reset its internal state
//     const handleRateCustomerClick = (booking: Booking) => {
//         setCurrentBookingToRate(booking);
//         setRatingValue(0); // Reset rating
//         setComment(''); // Reset comment
//         setRatingError(null); // Clear any previous rating error
//         setIsRatingModalOpen(true);
//     };
 
//     // Handler for when the rating is successfully submitted
//     const handleRatingSubmit = () => {
//         setIsRatingModalOpen(false); // Close the modal
//         setCurrentBookingToRate(null); // Clear the booking to rate
//         fetchBookings(); // Re-fetch bookings to update the rating status
//     };
 
//     // Handler for submitting the rating from the modal
//     const handleSubmitRatingFromModal = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setRatingError(null);
//         setSubmittingRating(true);
 
//         if (ratingValue === 0) {
//             setRatingError("Please select a rating.");
//             setSubmittingRating(false);
//             return;
//         }
 
//         if (!currentBookingToRate) {
//             setRatingError("No booking selected for rating.");
//             setSubmittingRating(false);
//             return;
//         }
 
//         try {
//             const providerUsername = localStorage.getItem('username');
//             if (!providerUsername) {
//                 setRatingError("Provider username not found. Cannot submit rating.");
//                 setSubmittingRating(false);
//                 return;
//             }
 
//             // Backend endpoint: /api/provider/rate-customer/{providerId}/{bookingId}/{ratingValue}
//             // Note: Your current backend endpoint does NOT accept a 'comment' in the request body.
//             // If you need to send a comment, you'll need to modify your backend DTO and controller.
//             await axios.post(`${API_BASE_URL}/provider/rate-customer/${providerUsername}/${currentBookingToRate.bookingId}/${ratingValue}`,
//                 {}, // Empty body, as comment is not accepted by the current backend endpoint
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
 
//             alert('Rating submitted successfully!');
//             handleRatingSubmit(); // Calls the parent's onRatingSubmit logic
//         } catch (err: any) {
//             console.error('Failed to submit rating:', err);
//             setRatingError(err.response?.data?.message || 'Failed to submit rating. Please try again.');
//         } finally {
//             setSubmittingRating(false);
//         }
//     };
 
 
//     if (loading && !bookings.length) {
//         return <div className="text-center text-gray-600 p-8 flex items-center justify-center"><Clock className="mr-2 h-5 w-5 animate-spin"/> Loading booking requests...</div>;
//     }
 
//     if (error) {
//         return <div className="text-center text-red-600 p-8 flex items-center justify-center"><Clock className="mr-2 h-5 w-5"/> {error}</div>;
//     }
 
//     if (bookings.length === 0) {
//         return <div className="text-center text-gray-600 p-8 flex items-center justify-center"><Info className="mr-2 h-5 w-5"/> No booking requests found.</div>;
//     }
 
//     return (
//         <div className="bg-white rounded-xl p-6 shadow-md">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Booking Requests</h3>
 
//             <div className="space-y-4">
//                 {bookings.map((booking) => (
//                     <div key={booking.bookingId} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//                          <div className="flex-grow mb-2 sm:mb-0">
//                             <p className="text-lg font-semibold text-gray-800">Booking ID: {booking.bookingId}</p>
//                             <p className="text-gray-700">Customer: {booking.customer.customerName}</p>
//                             {/* Apply optional chaining here */}
//                             <p className="text-gray-600">Service: {booking.service?.serviceName || 'N/A'}</p> 
//                             <p className="text-gray-600">Date/Time: {new Date(booking.dateTime).toLocaleString()}</p>
//                             <p className={`font-medium ${
//                                 booking.status === 'REQUESTED' ? 'text-yellow-600' :
//                                 booking.status === 'BOOKED' ? 'text-blue-600' :
//                                 booking.status === 'COMPLETED' ? 'text-green-600' :
//                                 'text-red-600'
//                             }`}>Status: {booking.status}</p>
//                         </div>
//                         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//                             {(booking.status === 'REQUESTED') && (
//                                 <>
//                                     <button
//                                         onClick={() => handleUpdateBookingStatus(booking.bookingId, 'ACCEPTED')}
//                                         className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//                                         disabled={loading}
//                                     >
//                                         <CheckCircle className="h-5 w-5 mr-2" /> Accept
//                                     </button>
//                                     <button
//                                         onClick={() => handleUpdateBookingStatus(booking.bookingId, 'REJECTED')}
//                                         className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//                                         disabled={loading}
//                                     >
//                                         <XCircle className="h-5 w-5 mr-2" /> Reject
//                                     </button>
//                                 </>
//                             )}
//                             {booking.status === 'BOOKED' && (
//                                 <button
//                                     onClick={() => handleUpdateBookingStatus(booking.bookingId, 'COMPLETED')}
//                                     className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                                     disabled={loading}
//                                 >
//                                     <Clock className="h-5 w-5 mr-2" /> Mark Completed
//                                 </button>
//                             )}
//                             {booking.status === 'COMPLETED' && !booking.rating && (
//                                 <button
//                                     onClick={() => handleRateCustomerClick(booking)}
//                                     className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
//                                     disabled={loading}
//                                 >
//                                     <Star className="h-5 w-5 mr-2" /> Rate Customer
//                                 </button>
//                             )}
//                             {booking.status === 'COMPLETED' && booking.rating && (
//                                 <span className="flex items-center px-4 py-2 text-green-700 bg-green-100 rounded-md">
//                                     <Info className="h-5 w-5 mr-2" /> Customer Rated
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
 
//             {/* --- Start of Merged ProviderRatingCustomer Component --- */}
//             {isRatingModalOpen && currentBookingToRate && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
//                         <button onClick={() => setIsRatingModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
//                             <XCircle className="h-6 w-6" />
//                         </button>
//                         <h2 className="text-xl font-bold mb-4 text-gray-800">Rate Customer: {currentBookingToRate.customer.customerName}</h2>
 
//                         {ratingError && <p className="text-red-500 text-sm mb-4">{ratingError}</p>}
 
//                         <form onSubmit={handleSubmitRatingFromModal} className="space-y-4">
//                             <div>
//                                 <label className="block text-gray-700 text-sm font-semibold mb-2">Rating:</label>
//                                 <div className="flex space-x-1">
//                                     {[1, 2, 3, 4, 5].map((starValue) => (
//                                         <Star
//                                             key={starValue}
//                                             onClick={() => setRatingValue(starValue)} // Update ratingValue state
//                                             className={`cursor-pointer h-8 w-8 ${
//                                                 starValue <= ratingValue ? 'text-yellow-500' : 'text-gray-300'
//                                             } transition-colors`}
//                                             fill={starValue <= ratingValue ? 'currentColor' : 'none'}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>
//                             {/* The comment field is here, but its value won't be sent by the current backend API */}
//                             <div>
//                                 <label htmlFor="comment" className="block text-gray-700 text-sm font-semibold mb-2">
//                                     Comment (Optional):
//                                 </label>
//                                 <textarea
//                                     id="comment"
//                                     value={comment}
//                                     onChange={(e) => setComment(e.target.value)}
//                                     rows={3}
//                                     className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Enter your comments about the customer..."
//                                 ></textarea>
//                             </div>
//                             <button
//                                 type="submit"
//                                 disabled={submittingRating} // Use submittingRating state
//                                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {submittingRating ? 'Submitting...' : 'Submit Rating'}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//             {/* --- End of Merged ProviderRatingCustomer Component --- */}
//         </div>
//     );
// };
 
// export default ProviderBookingRequests;
// src/components/ProviderBookingRequests.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Info, Star} from 'lucide-react';
// import ProviderRatingCustomer from './ProviderRatingCustomer'; // No longer needed as it's merged
import { Provider } from '../components/exportTypes'; // Ensure this path is correct for your Provider interface
 
const API_BASE_URL = 'http://localhost:8080/api';
 
// Interface for Customer as received from the backend
interface Customer {
    username: string;
    customerName: string;
    location: string;
    mobileNumber: string; // Changed from BigInt as JSON numbers are typically represented as strings or numbers in JS
    email: string;
    rating: number; // Assuming this is an average rating from their bookings
    profilePicture: string; // Assuming base64 encoded string or URL, not Uint8Array directly
    noOfBookings: number;
}
 
// Interface for ServiceEntity as received from the backend
interface ServiceEntity {
    serviceId: string;
    serviceName: string;
    noOfProviders: number;
}
 
// Interface for Booking as received from the backend
interface Booking {
    bookingId: string;
    provider: Provider;
    customer: Customer;
    location: string;
    dateTime: string;
    amountPaid: number;
    typeOfJob:string;
    status: 'REQUESTED' | 'PENDING' | 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
    rating?: any; // Added this to represent the presence of a rating object (or null)
}
 
const ProviderBookingRequests: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const providerUsername = localStorage.getItem('username');
 
    // State for the Rating Modal
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [currentBookingToRate, setCurrentBookingToRate] = useState<Booking | null>(null);
    // States that were originally in ProviderRatingCustomer.tsx
    const [ratingValue, setRatingValue] = useState(0); // Renamed to avoid conflict with `rating` in Booking interface
    const [comment, setComment] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false); // Renamed to avoid conflict
    const [ratingError, setRatingError] = useState<string | null>(null); // Renamed to avoid conflict
 
    const fetchBookings = async () => {
        if (!providerUsername) {
            setError("Provider username not found. Cannot fetch bookings.");
            setLoading(false);
            return;
        }
 
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<Booking[]>(
                `${API_BASE_URL}/bookings/all-received-requests/${providerUsername}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            console.log("Full API Response Data:", res.data);
            setBookings(res.data);
        } catch (err: any) {
            console.error('Failed to fetch bookings:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to load bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };
 
    useEffect(() => {
        fetchBookings();
    }, [providerUsername]);
 
    const handleUpdateBookingStatus = async (bookingId: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') => {
        setLoading(true);
        setError(null);
        try {
            let endpoint = '';
            if (status === 'ACCEPTED') {
                endpoint = `${API_BASE_URL}/bookings/accept-request/${bookingId}`;
            } else if (status === 'REJECTED') {
                endpoint = `${API_BASE_URL}/bookings/reject-request/${bookingId}`;
            } else if (status === 'COMPLETED') {
                endpoint = `${API_BASE_URL}/bookings/complete/${bookingId}`;
            } else {
                console.error("Invalid status for update:", status);
                setError("Invalid status update request.");
                setLoading(false);
                return;
            }
 
            await axios.put(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            await fetchBookings();
            alert(`Booking ${bookingId} status updated to ${status}.`);
        } catch (err: any) {
            console.error(`Failed to update booking status for ${bookingId}:`, err.response?.data || err);
            setError(err.response?.data?.message || `Failed to update status for booking ${bookingId}.`);
        } finally {
            setLoading(false);
        }
    };
 
    // Handler to open the rating modal and reset its internal state
    const handleRateCustomerClick = (booking: Booking) => {
        setCurrentBookingToRate(booking);
        setRatingValue(0); // Reset rating
        setComment(''); // Reset comment
        setRatingError(null); // Clear any previous rating error
        setIsRatingModalOpen(true);
    };
 
    // Handler for when the rating is successfully submitted
    const handleRatingSubmit = () => {
        setIsRatingModalOpen(false); // Close the modal
        setCurrentBookingToRate(null); // Clear the booking to rate
        fetchBookings(); // Re-fetch bookings to update the rating status
    };
 
    // Handler for submitting the rating from the modal
    const handleSubmitRatingFromModal = async (e: React.FormEvent) => {
        e.preventDefault();
        setRatingError(null);
        setSubmittingRating(true);
 
        if (ratingValue === 0) {
            setRatingError("Please select a rating.");
            setSubmittingRating(false);
            return;
        }
 
        if (!currentBookingToRate) {
            setRatingError("No booking selected for rating.");
            setSubmittingRating(false);
            return;
        }
 
        try {
            const providerUsername = localStorage.getItem('username');
            if (!providerUsername) {
                setRatingError("Provider username not found. Cannot submit rating.");
                setSubmittingRating(false);
                return;
            }
 
            // Backend endpoint: /api/provider/rate-customer/{providerId}/{bookingId}/{ratingValue}
            // Note: Your current backend endpoint does NOT accept a 'comment' in the request body.
            // If you need to send a comment, you'll need to modify your backend DTO and controller.
            await axios.post(`${API_BASE_URL}/provider/rate-customer/${providerUsername}/${currentBookingToRate.bookingId}/${ratingValue}`,
                {}, // Empty body, as comment is not accepted by the current backend endpoint
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
 
            alert('Rating submitted successfully!');
            handleRatingSubmit(); // Calls the parent's onRatingSubmit logic
        } catch (err: any) {
            console.error('Failed to submit rating:', err);
            setRatingError(err.response?.data?.message || 'Failed to submit rating. Please try again.');
        } finally {
            setSubmittingRating(false);
        }
    };
 
 
    if (loading && !bookings.length) {
        return <div className="text-center text-gray-600 p-8 flex items-center justify-center"><Clock className="mr-2 h-5 w-5 animate-spin"/> Loading booking requests...</div>;
    }
 
    if (error) {
        return <div className="text-center text-red-600 p-8 flex items-center justify-center"><Clock className="mr-2 h-5 w-5"/> {error}</div>;
    }
 
    if (bookings.length === 0) {
        return <div className="text-center text-gray-600 p-8 flex items-center justify-center"><Info className="mr-2 h-5 w-5"/> No booking requests found.</div>;
    }
 
    return (
        <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Booking Requests</h3>
 
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div key={booking.bookingId} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex-grow mb-2 sm:mb-0">
                            <p className="text-lg font-semibold text-gray-800">Booking ID: {booking.bookingId}</p>
                            <p className="text-gray-700">Customer: {booking.customer.customerName}</p>
                            <p className="text-gray-600">Service: {booking.typeOfJob}</p>
                            <p className="text-gray-600">Date/Time: {new Date(booking.dateTime).toLocaleString()}</p>
                            <p className="text-gray-600">Amount: ₹{booking.amountPaid}</p> {/* Added or confirmed this line */}
                            <p className={`font-medium ${
                                booking.status === 'REQUESTED' ? 'text-yellow-600' :
                                booking.status === 'BOOKED' ? 'text-blue-600' :
                                booking.status === 'COMPLETED' ? 'text-green-600' :
                                'text-red-600'
                            }`}>Status: {booking.status}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            {(booking.status === 'REQUESTED') && (
                                <>
                                    <button
                                        onClick={() => handleUpdateBookingStatus(booking.bookingId, 'ACCEPTED')}
                                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                        disabled={loading}
                                    >
                                        <CheckCircle className="h-5 w-5 mr-2" /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleUpdateBookingStatus(booking.bookingId, 'REJECTED')}
                                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        disabled={loading}
                                    >
                                        <XCircle className="h-5 w-5 mr-2" /> Reject
                                    </button>
                                </>
                            )}
                            {booking.status === 'BOOKED' && (
                                <button
                                    onClick={() => handleUpdateBookingStatus(booking.bookingId, 'COMPLETED')}
                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    disabled={loading}
                                >
                                    <Clock className="h-5 w-5 mr-2" /> Mark Completed
                                </button>
                            )}
                            {booking.status === 'COMPLETED' && !booking.rating && (
                                <button
                                    onClick={() => handleRateCustomerClick(booking)}
                                    className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                                    disabled={loading}
                                >
                                    <Star className="h-5 w-5 mr-2" /> Rate Customer
                                </button>
                            )}
                            {booking.status === 'COMPLETED' && booking.rating && (
                                <span className="flex items-center px-4 py-2 text-green-700 bg-green-100 rounded-md">
                                    <Info className="h-5 w-5 mr-2" /> Customer Rated
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
 
            {/* --- Start of Merged ProviderRatingCustomer Component --- */}
            {isRatingModalOpen && currentBookingToRate && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                        <button onClick={() => setIsRatingModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                            <XCircle className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Rate Customer: {currentBookingToRate.customer.customerName}</h2>
 
                        {ratingError && <p className="text-red-500 text-sm mb-4">{ratingError}</p>}
 
                        <form onSubmit={handleSubmitRatingFromModal} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Rating:</label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((starValue) => (
                                        <Star
                                            key={starValue}
                                            onClick={() => setRatingValue(starValue)}
                                            className={`cursor-pointer h-8 w-8 ${
                                                starValue <= ratingValue ? 'text-yellow-500' : 'text-gray-300'
                                            } transition-colors`}
                                            fill={starValue <= ratingValue ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Comment (Optional):
                                </label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your comments about the customer..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submittingRating}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submittingRating ? 'Submitting...' : 'Submit Rating'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* --- End of Merged ProviderRatingCustomer Component --- */}
        </div>
    );
};
 
export default ProviderBookingRequests;