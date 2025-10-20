import { Services, UserAccount } from "../components/exportTypes";

export type ServiceType=UserAccount& {
    // serviceId: string;
    // serviceName: string;
    // noOfProviders: number;
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

  export type ServiceTypes = {
    serviceId: string;  
    serviceName: string;
    noOfProviders: number;}