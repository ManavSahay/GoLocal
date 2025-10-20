// src/components/ProviderDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Calendar, Award, LayoutDashboard } from 'lucide-react'; // LogOut is no longer needed
 
// Import the tab content components
import ProviderProfileInfo from '../components/ProviderProfileInfo';
import ProviderBookingRequests from '../components/ProviderBookingRequests';
 
const API_BASE_URL = 'http://localhost:8080/api'; // Your backend base URL
 
// Define the possible tabs
type DashboardTab = 'profileInfo' | 'bookingRequests' | 'ratingCustomers';
 
const ProviderDashboard: React.FC = () => {
    // State for managing active tab
    const [activeTab, setActiveTab] = useState<DashboardTab>('profileInfo'); // Default to 'profileInfo'
    const navigate = useNavigate();
 
    // Basic authentication check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { // Ensure only providers access this dashboard
            console.warn("Authentication failed or role mismatch. Redirecting to login.");
            navigate('/auth'); // Redirect to login if not authenticated or not a provider
        }
    }, [navigate]);
 
    // handleLogout function is no longer needed as the logout button is removed
    /*
    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {
            console.error('Logout API might have failed, but clearing local storage:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            navigate('/auth'); // Redirect to login page
        }
    };
    */
 
    const username = localStorage.getItem('username'); // Get username for display
 
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Removed the entire <header> section including GoLocal branding, nav links, and logout */}
 
            {/* Provider Dashboard Title & System Access - This is now the first element */}
            <div className="container mx-auto p-4 pt-8">
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                        <LayoutDashboard className="h-8 w-8 text-blue-600" />
                        <span>Provider Dashboard</span>
                    </h2>
                    <p className="text-gray-600">
                        Welcome back {username || 'Provider'}, manage your services and bookings efficiently.
                    </p>
                    <div className="flex items-center text-sm mt-3 text-gray-500">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold mr-2">Provider</span>
                        <span className="text-blue-600 flex items-center">
                            <LayoutDashboard className="h-4 w-4 mr-1" />
                            System Access
                        </span>
                    </div>
                </div>
 
                {/* Sub-Tabs for Provider Dashboard content (Profile, Bookings, Ratings) */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-start items-center space-x-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('profileInfo')}
                        className={`py-2 px-4 text-lg font-medium transition-colors relative group
                            ${activeTab === 'profileInfo' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                    >
                        <User className="inline-block h-5 w-5 mr-2" />
                        <span>Profile Info</span>
                        {activeTab === 'profileInfo' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('bookingRequests')}
                        className={`py-2 px-4 text-lg font-medium transition-colors relative group
                            ${activeTab === 'bookingRequests' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                    >
                        <Calendar className="inline-block h-5 w-5 mr-2" />
                        <span>Booking Requests</span>
                        {activeTab === 'bookingRequests' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('ratingCustomers')}
                        className={`py-2 px-4 text-lg font-medium transition-colors relative group
                            ${activeTab === 'ratingCustomers' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                    >
                        <Award className="inline-block h-5 w-5 mr-2" />
                        <span>Rate Customers</span>
                        {activeTab === 'ratingCustomers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
                    </button>
                </div>
            </div>
 
            {/* Main Content Area - Renders the active tab's component */}
            <main className="container mx-auto p-4 flex-grow">
                {activeTab === 'profileInfo' && <ProviderProfileInfo />}
                {activeTab === 'bookingRequests' && <ProviderBookingRequests />}
                {activeTab === 'ratingCustomers' && (
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Rate Your Customers</h3>
                        <p className="text-gray-700 mb-4">
                            To rate a customer, navigate to the **Booking Requests** tab. Once a booking is marked as "Completed," you will find an option to "Rate Customer" next to that specific booking.
                        </p>
                        <p className="text-gray-700">
                            This approach ensures that customer ratings are directly linked to completed services.
                        </p>
                        <button
                            onClick={() => setActiveTab('bookingRequests')}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <Calendar className="h-5 w-5" />
                            <span>Go to Booking Requests</span>
                        </button>
                    </div>
                )}
            </main>
 
            {/* Footer (Optional) - Consistent with the general aesthetic */}
            <footer className="bg-white text-gray-600 text-center p-4 mt-auto shadow-inner border-t border-gray-200">
                <p>&copy; {new Date().getFullYear()} GoLocal Services. All rights reserved.</p>
            </footer>
        </div>
    );
};
 
export default ProviderDashboard;