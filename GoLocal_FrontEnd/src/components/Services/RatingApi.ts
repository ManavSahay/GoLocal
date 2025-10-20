// src/services/ratingApi.ts
import axios from 'axios';

// Base URL for API endpoints.
// This is the base for your customer-specific rating endpoint.
const API_BASE_URL = 'http://localhost:8080/api';

// Response type for successful rating operations
interface RatingResponse {
  message: string;
  // Add other relevant fields if your backend returns them (e.g., updated booking details)
}

export const ratingApi = {
  /**
   * Allows a customer to rate a provider for a specific booking.
   * This calls the backend endpoint: POST /api/customer/rate-provider/{customerId}/{bookingId}/{ratingValue}
   *
   * @param customerId The ID of the customer making the rating (e.g., username).
   * @param bookingId The ID of the booking being rated.
   * @param ratingValue The integer rating given by the customer (e.g., 1-5).
   * @param token The authentication token of the customer.
   * @returns A promise that resolves with the API response.
   */
  customerRateProvider: async (
    customerId: string,
    bookingId: string,
    ratingValue: number,
    token: string
  ): Promise<RatingResponse> => {
    try {
      // The API uses path variables, so the request body can be empty for a POST request.
      const response = await axios.post<RatingResponse>(
        `${API_BASE_URL}/customer/rate-provider/${customerId}/${bookingId}/${ratingValue}`,
        {}, // Empty body, as parameters are in URL path
        {
          headers: {
            'Content-Type': 'application/json', // Still good practice to specify
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error customer rating provider:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to rate provider');
      } else {
        console.error('Unexpected error customer rating provider:', error);
        throw new Error('An unexpected error occurred.');
      }
    }
  },
};