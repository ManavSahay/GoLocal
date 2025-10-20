// src/components/CustomerDashboard/BookingList.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StarRating from "../Common/StarRating";
import { ratingApi } from "../Services/RatingApi"; // Corrected relative path to services
import { bookingApi, Booking, BookingStatusFrontend } from "../Services/BookingApi"; // Import Booking and BookingStatusFrontend types

interface BookingListProps {
    // Corrected to match backend enum values for status filter
    statusFilter?: BookingStatusFrontend | "ALL";
}

const BookingList: React.FC<BookingListProps> = ({ statusFilter = "ALL" }) => {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for rating modal/form
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [currentBookingToRate, setCurrentBookingToRate] =
        useState<Booking | null>(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
    const [ratingError, setRatingError] = useState<string | null>(null);

    // --- Fetch Bookings Function ---
    const fetchBookings = useCallback(async () => {
        if (!user?.username || user.role !== "ROLE_CUSTOMER") {
            setBookingsLoading(false);
            setBookings([]);
            setError("Please log in as a customer to view your bookings.");
            console.error("BookingList: User not authenticated as customer or username missing.");
            return;
        }

        try {
            setBookingsLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token missing. Please log in.");
                setBookingsLoading(false);
                return;
            }

            // Use the new bookingApi service to fetch bookings
            // Pass user.username directly as customerId
            const fetchedBookings = await bookingApi.getBookingRequests(
                user.username, // customerId for the backend
                token,
                statusFilter // Pass the status filter
            );

            console.log("Fetched customer bookings:", fetchedBookings);
            setBookings(fetchedBookings);

        } catch (err: any) {
            console.error("Failed to fetch customer bookings:", err);
            // Improve error message display based on Axios error structure
            setError(err.message || "Failed to fetch bookings. Please try again.");
            setBookings([]);
        } finally {
            setBookingsLoading(false);
        }
    }, [user?.username, user?.role, statusFilter]);

    // --- useEffect for Fetching Bookings ---
    useEffect(() => {
        if (!authLoading && isAuthenticated && user?.username && user?.role === "ROLE_CUSTOMER") {
            fetchBookings();
        } else if (!authLoading && (!isAuthenticated || user?.role !== "ROLE_CUSTOMER")) {
            setBookingsLoading(false);
            setBookings([]);
            setError("Please log in as a customer to view your bookings.");
        }
    }, [user?.username, user?.role, authLoading, isAuthenticated, fetchBookings]);

    // --- Booking Action Handlers (Revoke, Complete) ---
    const handleRevokeBooking = async (bookingId: string) => {
        if (!window.confirm("Are you sure you want to revoke this booking?")) {
            return;
        }
        setBookingsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token missing.");
            }
            await bookingApi.revokeBooking(bookingId, token);
            alert("Booking revoked successfully!");
            fetchBookings();
        } catch (err: any) {
            console.error("Failed to revoke booking:", err);
            setError(err.message || "Failed to revoke booking. Please try again.");
        } finally {
            setBookingsLoading(false);
        }
    };

    const handleCompleteService = async (bookingId: string) => {
        if (
            !window.confirm("Are you sure you want to mark this service as complete?")
        ) {
            return;
        }
        setBookingsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token missing.");
            }
            await bookingApi.completeService(bookingId, token);
            alert("Service marked as complete!");
            fetchBookings();
        } catch (err: any) {
            console.error("Failed to complete service:", err);
            setError(err.message || "Failed to mark service as complete. Please try again.");
        } finally {
            setBookingsLoading(false);
        }
    };

    // --- Rating Modal Handlers ---
    const handleOpenRatingModal = (booking: Booking) => {
        setCurrentBookingToRate(booking);
        setRatingValue(0);
        setRatingError(null);
        setShowRatingModal(true);
    };

    const handleCloseRatingModal = () => {
        setShowRatingModal(false);
        setCurrentBookingToRate(null);
        setRatingValue(0);
        setRatingError(null);
        setIsRatingSubmitting(false);
    };

    const handleRateProvider = async () => {
        if (!currentBookingToRate || ratingValue === 0) {
            setRatingError("Please select a booking and provide a rating (1-5).");
            return;
        }
        if (!user?.username) {
            setRatingError("User information missing. Please re-login.");
            return;
        }
        if (!currentBookingToRate.providerId) {
            setRatingError("Provider ID missing for this booking. Cannot submit rating.");
            return;
        }

        setIsRatingSubmitting(true);
        setRatingError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setRatingError("Authentication token missing. Please log in.");
                setIsRatingSubmitting(false);
                return;
            }

            const response = await ratingApi.customerRateProvider(
                user.username,
                currentBookingToRate.bookingId,
                ratingValue,
                token
            );

            alert(response.message || "Provider rated successfully!");
            handleCloseRatingModal();
            fetchBookings();
        } catch (err: any) {
            console.error("Failed to rate provider:", err.message || err);
            setRatingError(err.message || "Failed to rate provider. Please try again.");
        } finally {
            setIsRatingSubmitting(false);
        }
    };

    // --- Conditional Rendering for Loading/Error/No Bookings ---
    if (authLoading || bookingsLoading) {
        return <p className="text-gray-600">Loading your bookings...</p>;
    }

    if (!isAuthenticated || !user?.username || user?.role !== "ROLE_CUSTOMER") {
        return (
            <p className="text-red-600">
                Please log in as a customer to view your bookings.
            </p>
        );
    }

    if (error) {
        return <p className="text-red-600">Error: {error}</p>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Your Bookings</h2>
            {bookings.length === 0 ? (
                <p className="text-gray-500">
                    **No services booked yet. Start exploring and book your first service!**
                </p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.bookingId}
                            className="border rounded-xl p-4 bg-gray-50 shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {booking.bookingId}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Provider: {booking.providerName}
                                    </p>
                                    <p className="text-sm text-gray-600">Date: {booking.bookingDate}</p> {/* Use bookingDate */}
                                </div>
                                <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                                        booking.status === "COMPLETED"
                                            ? "bg-green-100 text-green-700"
                                            : booking.status === "REVOKED" || booking.status === "REJECTED"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700" // For REQUESTED, BOOKED
                                    }`}
                                >
                                    {booking.status}
                                </span>
                            </div>
                            <div className="mt-2 space-x-2">
                                {/* Use backend enum values for status checks */}
                                {booking.status === "REQUESTED" && (
                                    <button
                                        onClick={() => handleRevokeBooking(booking.bookingId)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    >
                                        Revoke
                                    </button>
                                )}
                                {booking.status === "BOOKED" && ( // Assuming "BOOKED" is equivalent to "ACCEPTED" from your previous description
                                    <button
                                        onClick={() => handleCompleteService(booking.bookingId)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Mark as Complete
                                    </button>
                                )}
                                {/* --- Rating Button Logic --- */}
                                {booking.status === "COMPLETED" && !booking.rated && (
                                    <button
                                        onClick={() => handleOpenRatingModal(booking)}
                                        className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                    >
                                        Rate Service
                                    </button>
                                )}
                                {booking.status === "COMPLETED" && booking.rated && (
                                    <span className="text-gray-500 text-sm italic px-3 py-1 border border-gray-300 rounded-md">
                                        Service Rated
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Rating Modal Component --- */}
            {showRatingModal && currentBookingToRate && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4">
                            Rate {currentBookingToRate.providerName}
                        </h3>
                        <p className="mb-4">For service: {currentBookingToRate.serviceName}</p>
                        <StarRating rating={ratingValue} onRatingChange={setRatingValue} />
                        {ratingError && <p className="text-red-500 text-sm mt-2">{ratingError}</p>}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={handleCloseRatingModal}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                disabled={isRatingSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRateProvider}
                                disabled={ratingValue === 0 || isRatingSubmitting}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {isRatingSubmitting ? 'Submitting...' : 'Submit Rating'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;