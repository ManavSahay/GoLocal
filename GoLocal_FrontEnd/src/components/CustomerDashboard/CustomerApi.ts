// src/components/customerDashboard/customerApi.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// This payload type defines the *optional* fields that can be sent for an update.
// It reflects a partial update capability.
// If your backend DTO has `@NotBlank` on certain fields, and you're doing a PUT
// (which often implies sending the full resource), then you MUST send all
// required fields, even if they haven't changed.
// For now, we assume your backend can handle missing fields gracefully for PATCH-like behavior.
export interface CustomerUpdatePayload {
    username: string;
    customerName?: string;
    location?: string;
    mobileNumber?: number; // Backend expects 'long', so TypeScript 'number' is appropriate
    email?: string;
    profilePicture?: string;
}

export const updateCustomer = async (
    customerId: string, // This is the username from the frontend, used in the path
    payload: CustomerUpdatePayload, // The object containing only the fields to be updated
    token: string // Auth token
) => {
    console.log("Inside updateCustomer function. customerId:", customerId);
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/customer/update-customer/${customerId}`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        console.log("Customer ID (username) used in API call:", customerId);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating customer:', error.response?.data || error.message);
            if (error.response?.status === 400 && error.response?.data?.errors) {
                const backendErrors = error.response.data.errors.map((err: any) => err.defaultMessage).join(', ');
                throw new Error(`Validation failed: ${backendErrors}`);
            }
            throw new Error(error.response?.data?.message || 'Failed to update customer profile. Please try again.');
        } else {
            console.error('An unexpected error occurred during customer update:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
};