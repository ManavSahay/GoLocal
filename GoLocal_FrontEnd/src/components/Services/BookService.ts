// src/services/bookingService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

interface BookProviderPayload { // Renamed from BookingRequestPayload to match backend DTO more closely
  providerId: string;
  location: string;
  dateTime: string; // Formatted as "dd-MM-yyyy HH:mm"
  amount: string;
}

interface BookingResponse {
  message: string;
  bookingId?: string;
  status?: string;
  // Add other fields you expect in a successful booking response
}

const bookingService = {
  
  bookService: async (
    customerId: string, // Add customerId parameter
    typeOfJob: string,   // Add typeOfJob parameter
    payload: BookProviderPayload // Keep the body payload
  ): Promise<BookingResponse> => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }

    try {
      // Construct the URL with path variables
      const url = `${API_BASE_URL}/bookings/book-request/${typeOfJob}/${customerId}`;
        
      const response = await axios.post<BookingResponse>(
        url, // Use the constructed URL
        payload, // This remains the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bookingService;