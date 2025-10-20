// src/components/CustomerDashboard/BookServiceForm.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import bookingService from "../Services/BookService";
import axios from 'axios'; // Import axios here to use axios.isAxiosError

interface BookServiceFormProps {
  onServiceBooked?: () => void;
  initialProviderId?: string;
  initialBookingAmount?: string;
  // If typeOfJob is always fixed or passed from parent, you might add:
  // initialTypeOfJob?: string;
}

const BookServiceForm: React.FC<BookServiceFormProps> = ({
  onServiceBooked,
  initialProviderId,
  initialBookingAmount,
}) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [providerId, setProviderId] = useState(initialProviderId || "");
  const [bookingLocation, setBookingLocation] = useState( "");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingAmount, setBookingAmount] = useState(initialBookingAmount || "");
  const [typeOfJob, setTypeOfJob] = useState(""); // Add state for typeOfJob

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("BookServiceForm - useEffect triggered");
    console.log("Current user object:", user);
    console.log("Is Authenticated:", isAuthenticated);
    console.log("Auth Loading:", authLoading);
    //console.log("Authentication Token:", token ? `Token available (length: ${token.length})` : "No token available");
    if (initialProviderId !== undefined && initialProviderId !== providerId) {
      setProviderId(initialProviderId);
    }
    if (initialBookingAmount !== undefined && initialBookingAmount !== bookingAmount) {
      setBookingAmount(initialBookingAmount);
    }
    // if (user?.location && bookingLocation === "") {
    //   setBookingLocation(user.location);
    // }
    // If you add initialTypeOfJob prop, update here too
  }, [initialProviderId, initialBookingAmount, user?.location, providerId, bookingAmount, bookingLocation]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!isAuthenticated || authLoading) {
      setError("You must be logged in as a customer to book a service.");
      return;
    }

    // Ensure user.id (or whatever field holds customerId) is available
    if (!user || !user.username) { // Assuming 'id' is the customerId field in your user object
      setError("Customer ID not found. Please ensure you are logged in correctly.");
      return;
    }
    console.log("Role before API call:", user.role); 
    const customerId = user.username; // Get customerId from authenticated user

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const [year, month, day] = bookingDate.split('-');
    const formattedDateTime = `${year}-${month}-${day} ${bookingTime}`;

    const amountFloat = parseFloat(bookingAmount);

    // Add validation for typeOfJob
    if (!providerId || !bookingLocation || !bookingDate  ||  !bookingAmount || !typeOfJob) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    console.log("Auth State:", { isAuthenticated, user });
    console.log("Customer ID being used:", user?.username);
    console.log("Type of Job being used:", typeOfJob);
    console.log("Booking Payload:", { providerId, location: bookingLocation, dateTime: formattedDateTime, amount: amountFloat });
    if (isNaN(amountFloat) || amountFloat < 100 || amountFloat > 10000) {
      setError("Amount must be a number between 100 and 10000.");
      setLoading(false);
      return;
    }

    try {
      // Call the service function with customerId and typeOfJob
      const response = await bookingService.bookService(
        customerId, // Pass customerId as argument
        typeOfJob,  // Pass typeOfJob as argument
        {
          providerId,
          location: bookingLocation,
          dateTime: formattedDateTime,
          amount: amountFloat.toString(),
        }
      );

      setSuccessMessage(response.message || "Service request booked successfully!");

      setProviderId(initialProviderId || "");
      setBookingLocation(user?.location || "");
      setBookingDate("");
      setBookingTime("");
      setBookingAmount(initialBookingAmount || "");
      setTypeOfJob(""); // Clear typeOfJob after successful submission

      onServiceBooked?.();
      
    } catch (err: any) {
      console.error("Failed to book service:", err);
      console.log("Role before API call:", user.role); 
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "Failed to book service. Please try again.");
      } else {
        setError(err.message || "Failed to book service. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <p className="text-red-600">Please log in as a customer to book a service.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Book a New Service</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... existing fields */}

        <div>
          <label htmlFor="typeOfJob" className="block text-sm font-medium text-gray-700">Type of Job</label>
          <input
            type="text"
            id="typeOfJob"
            value={typeOfJob}
            onChange={(e) => setTypeOfJob(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="providerId" className="block text-sm font-medium text-gray-700">Provider ID</label>
          <input
            type="text"
            id="providerId"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            disabled={loading || !!initialProviderId}
            style={initialProviderId ? { backgroundColor: '#f3f4f6' } : {}}
          />
        </div>

        <div>
          <label htmlFor="bookingLocation" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="bookingLocation"
            value={bookingLocation}
            onChange={(e) => setBookingLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Preferred Date</label>
          <input
            type="date"
            id="bookingDate"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            disabled={loading}
          />
        </div>

        {/* <div>
          <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700">Preferred Time</label>
          <input
            type="time"
            id="bookingTime"
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            disabled={loading}
          />
        </div> */}

        <div>
          <label htmlFor="bookingAmount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="bookingAmount"
            value={bookingAmount}
            onChange={(e) => setBookingAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            min="100"
            max="10000"
            step="0.01"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="small" message="" /> : "Book Service"}
        </button>
      </form>
    </div>
  );
};

export default BookServiceForm;