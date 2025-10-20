// src/services/bookingApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// --- Define Booking Type (matching backend Booking entity fields more closely) ---
// Note: Frontend status might be a subset or mapping of backend enum.
// The backend uses: REQUESTED, BOOKED, REJECTED, REVOKED, COMPLETED
export type BookingStatusFrontend = "REQUESTED" | "BOOKED" | "REJECTED" | "REVOKED" | "COMPLETED";

export type Booking = {
    bookingId: string;
    // These fields should correspond to what your backend Booking entity (or its DTO) returns.
    // Adjust if your backend's JSON structure differs.
    serviceName: string;
    providerId: string;
    providerName: string;
    customerId: string;
    customerName: string;
    bookingDate: string; // This will typically be a formatted date string
    jobLocation: string;
    description: string;
    status: BookingStatusFrontend;
    rated: boolean; // Indicates if the booking has been rated
};

export const bookingApi = {
    /**
     * Fetches booking requests for a given customer username (which is the customerId as a path variable),
     * with an optional status filter.
     *
     * @param customerId The ID of the customer (username from frontend context).
     * @param token The authentication token.
     * @param statusFilter Optional. Filters bookings by status (e.g., "COMPLETED", "PENDING"). Defaults to "ALL".
     * @returns A promise that resolves with an array of Booking objects.
     * @throws Error if the API call fails or token is missing.
     */
    getBookingRequests: async (
        customerId: string, // Renamed from username to customerId for clarity
        token: string,
        statusFilter: "REQUESTED" | "BOOKED" | "REJECTED" | "REVOKED" | "COMPLETED" | "ALL" = "ALL" // Match backend enum
    ): Promise<Booking[]> => {
        try {
            let apiUrl = `${API_BASE_URL}/bookings/get-booked-requests/${customerId}`;

            const params: { [key: string]: string } = {};

            if (statusFilter !== "ALL") {
                params.status = statusFilter; // Backend will filter by this query param
            }

            console.log("BookingApi: Attempting to fetch bookings for customerId:", customerId);
            console.log("BookingApi: Token received for request:", token ? "Present" : "Missing", token);

            const res = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: Object.keys(params).length > 0 ? params : undefined, // Only send params if there are any
            });

            // Handle various backend response structures:
            // 1. Direct array of bookings
            // 2. Object with a 'bookings' key containing an array
            const fetchedBookings = Array.isArray(res.data)
                ? res.data
                : (res.data && Array.isArray(res.data.bookings))
                    ? res.data.bookings
                    : [];

            // --- IMPORTANT: Adjust this mapping based on your EXACT backend JSON response ---
            // Based on your Provider entity and common Spring Boot JPA practices,
            // we're assuming nested objects for `service`, `provider`, and `customer`.
            const typedBookings: Booking[] = fetchedBookings.map((b: any) => ({
                bookingId: b.bookingId || b.id, // Prefer bookingId, fallback to id if backend uses generic 'id'
                
                // Service Mapping: Assumes Booking has a `service` object, which has `serviceName`
                serviceName: b.service?.serviceName || b.service?.name || 'N/A', 
                
                // Provider Mapping: Assumes Booking has a `provider` object.
                // Provider's ID is `username`, name is `providerName`.
                providerId: b.provider?.username || b.provider?.id || 'N/A', 
                providerName: b.provider?.providerName || b.provider?.name || 'N/A', 
                
                // Customer Mapping: Assuming Customer entity also uses `username` as its ID
                // and has a `customerName` or `name` field. **Verify your Customer.java!**
                customerId: b.customer?.username || b.customer?.id || 'N/A', 
                customerName: b.customer?.customerName || b.customer?.name || 'N/A', 
                
                // Date/Time Mapping: Your backend `Booking` has `dateTime` (java.util.Date)
                // When serialized, it's often an ISO string. Convert it for display.
                bookingDate: b.dateTime ? new Date(b.dateTime).toLocaleDateString() : 'N/A', 
                
                // Location Mapping: Directly from backend 'location' field
                jobLocation: b.location || 'N/A', 
                
                // Description Mapping: **Crucial: Add `private String description;` to your Backend Booking entity**
                // Otherwise, this will always default to 'No description provided'.
                description: b.description || 'No description provided', 
                
                // Status Mapping: Direct match from backend 'status'
                status: (b.status || b.bookingStatus) as BookingStatusFrontend, 
                
                // Rated Mapping: **To make this work, remove @JsonIgnore from `rating` in backend Booking entity
                // OR add a transient `isRated` boolean field to your backend Booking DTO.**
                rated: !!b.rating // True if rating object exists, false otherwise.
                                  // Will be false if @JsonIgnore is on backend's `rating` field.
            }));

            return typedBookings;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Throw the backend error message if available
                console.error("Axios error during getBookingRequests:", error.response.data);
                throw new Error(error.response.data.message || 'Failed to fetch bookings.');
            } else {
                // Throw a generic error for network issues or unexpected errors
                console.error("Unexpected error during getBookingRequests:", error);
                throw new Error('An unexpected error occurred while fetching bookings.');
            }
        }
    },

    revokeBooking: async (bookingId: string, token: string): Promise<void> => {
        try {
            await axios.put(
                `${API_BASE_URL}/bookings/revoke-booking/${bookingId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Failed to revoke booking.');
            }
            throw new Error('An unexpected error occurred during booking revocation.');
        }
    },

    completeService: async (bookingId: string, token: string): Promise<void> => {
        try {
            // CORRECTED: Endpoint path from /booking/complete to /bookings/complete
            await axios.put(
                `${API_BASE_URL}/bookings/complete/${bookingId}`, // Corrected: /bookings/complete/{bookingId}
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Failed to mark service as complete.');
            }
            throw new Error('An unexpected error occurred during service completion.');
        }
    },
};