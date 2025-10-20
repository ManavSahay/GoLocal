// src/types/service.d.ts

import { Key, ReactNode } from 'react'; // Ensure these imports are present if you use them
import { UserAccount } from '../components/exportTypes';

export type Service= UserAccount & {
    // providerRating: number;
    // id: string; // Maps from backend `serviceId`
    // name: string; // Maps from backend `serviceName`
    // description: string;
    // imageUrl?: string | null; // Optional, can be string or null
    // price: number; // Assuming price is a number
    // providerId: string;
    // providerName: string;
    // rating?: number; // Optional, assuming rating can be undefined

    // // These properties are causing the error because they are present in the interface
    // // but not being mapped from the backend data in ServicePage.tsx.
    // // You have two choices:
    // // 1. Mark them as optional if they are not always present or not needed for this specific `Service` object.
    // // 2. Add them to your mapping logic in ServicePage.tsx if your backend *does* provide them and you need them.
    // providerLocation?: string; // Making it optional
    // providerMobileNumber?: string; // Making it optional
    // providerDescription?: string;
    // If your backend response for 'get-all-services' has other fields, you might need to add them here.
    // Example:
    // someOtherField?: string;
     providerName: string;
        location: string;
        mobileNumber: string; // Changed from BigInt to string as per your component's formData
        email: string;
        rating?: number;
        profilePicture: string | null; // Base64 string or null
        noOfBookings: number;
        service: Services; // Nested Services object
        experience: number;
        description: string | ArrayBuffer | { type: string, data: number[] } | Blob;
        noOfTimesBooked: number;

}

export interface GetAllServicesResponse {
    success: boolean;
    data: Service[]; // Assuming the API returns an array of Service objects
    message?: string;
}