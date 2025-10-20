// src/components/exportTypes.tsx

// Base type for any user account (customer or provider)
export type UserAccount = {
    username: string;
    password?: string; // Optional because it might not be sent on GET requests after login
    role: string;
    isDeleted: boolean;
};

// Type for Service details
export type Services = {
    serviceId: string;
    serviceName: string;
    noOfProviders: number;
};

// Customer type, extending UserAccount
export type Customer = UserAccount & {
    customerName: string;
    location: string;
    mobileNumber: string; // Changed from BigInt to string as per your component's formData
    email: string;
    rating: string;
    profilePicture: string | null; // Base64 string or null
    noOfBookings: number;
};

// Provider type, extending UserAccount
export type Provider = UserAccount & {
    providerName: string;
    location: string;
    mobileNumber: string; // Changed from BigInt to string as per your component's formData
    email: string;
    rating?: string;
    profilePicture: string | null; // Base64 string or null
    noOfBookings: number;
    service: Services; // Nested Services object
    experience: number;
    description: string | ArrayBuffer | { type: string, data: number[] } | Blob;
    noOfTimesBooked: number;
};


export interface ServiceType {
    serviceId: string;
    serviceName: string;
    // Add other fields if a service has more properties like 'description', 'price', etc.
  }

  export interface Booking {
    bookingId: string;
    provider: {
      username: string;
      providerName: string;
    };
    customer: {
      username: string;
      customerName: string;
    };
    location: string;
    dateTime: string;
    amountPaid: number;
    typeOfJob: string;
    status: string;
  }