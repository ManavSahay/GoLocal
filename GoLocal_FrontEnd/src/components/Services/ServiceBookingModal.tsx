// src/components/Services/ServiceBookingModal.tsx
import React from 'react';
import { Service } from '../../types/service';
import BookServiceForm from '../../components/CustomerDashboard/BookServiceForm'; // IMPORT YOUR EXISTING FORM!

interface ServiceBookingModalProps {
    service: Service | null; // The service chosen for booking
    onClose: () => void;
    onBookingSuccess: () => void; // Callback to refresh services or bookings list
}

const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ service, onClose, onBookingSuccess }) => {
    if (!service) {
        return null; // Don't render the modal if no service is selected
    }

    // We can pass the providerId directly to the BookServiceForm
    // and hide the providerId input in the form itself when used inside this modal.
    // For simplicity, we'll assume BookServiceForm can optionally receive a default providerId
    // or you'll modify it slightly to handle this.
    // A direct modification of BookServiceForm might be simpler, e.g., make providerId prop optional
    // and if provided, set it as default state and disable the input.

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                    Book Service: {service.name} (Provider: {service.providerName})
                </h2>
                <p className="text-gray-700 mb-4">Price: ${service.price.toFixed(2)}</p>

                {/* REUSING YOUR EXISTING BOOK SERVICE FORM */}
                <BookServiceForm
                    onServiceBooked={() => {
                        onBookingSuccess(); // Notify parent page of successful booking
                        onClose(); // Close the modal
                    }}
                    // You'll need to pass the providerId to your BookServiceForm
                    // You might need to modify BookServiceForm to accept an initialProviderId prop
                    // or modify its internal state logic.
                    // For now, let's assume you'll modify BookServiceForm to use a `service` prop
                    // instead of internal providerId state when used in this context.
                    // Or, pass a callback that uses the service.id:
                    // onInitialLoad: (setProviderIdCallback) => setProviderIdCallback(service.providerId)
                />
            </div>
        </div>
    );
};

export default ServiceBookingModal;