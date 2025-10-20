// src/components/ProviderProfileInfo.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, MapPin, Phone, Mail, Star, Briefcase, TrendingUp, CheckCircle, Edit, Save, XCircle, AlertTriangle } from 'lucide-react';
 
const API_BASE_URL = 'http://localhost:8080/api'; // Your backend base URL
 
interface Provider {
    username: string;
    providerName: string;
    location: string;
    mobileNumber: string;
    email: string;
    profilePicture: string;
    service: {
        serviceId: string;
        serviceName: string;
    };
    experience: number;
    description: string; // This is the field in question
    rating: string;
    noOfBookings: number;
    noOfTimesBooked: number;
}
 
// Helper function to decode base64 string to a human-readable string
// This is necessary if your backend is sending the description as a base64 encoded string
const decodeBase64ToString = (base64String: string | null | undefined): string => {
    if (!base64String) {
        return '';
    }
    try {
        // Use atob to decode the base64 string
        const decoded = atob(base64String);
        // Use decodeURIComponent and escape to handle UTF-8 characters correctly
        return decodeURIComponent(escape(decoded));
    } catch (e) {
        console.error("Error decoding base64 string:", e);
        // Return original string or an error message if decoding fails
        return base64String;
    }
};
 
const ProviderProfileInfo: React.FC = () => {
    const [providerData, setProviderData] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const username = localStorage.getItem('username');
 
    const [isEditing, setIsEditing] = useState(false);
    const [editedFormData, setEditedFormData] = useState<Partial<Provider>>({});
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
 
    useEffect(() => {
        const fetchProviderData = async () => {
            if (!username) {
                setError("Username not found. Please log in.");
                setLoading(false);
                return;
            }
 
            setLoading(true);
            setError(null);
            setSuccessMessage(null);
            try {
                const res = await axios.get<Provider>(
                    `${API_BASE_URL}/provider/get-profile/${username}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setProviderData(res.data);
                setEditedFormData({
                    username: res.data.username,
                    providerName: res.data.providerName,
                    location: res.data.location,
                    mobileNumber: String(res.data.mobileNumber),
                    email: res.data.email,
                    profilePicture: res.data.profilePicture,
                    experience: res.data.experience,
                    description: decodeBase64ToString(res.data.description), // Decode description here
                });
                setProfilePictureFile(null);
            } catch (err: any) {
                console.error('Failed to fetch provider data:', err);
                setError(err.response?.data?.message || 'Failed to load provider data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
 
        fetchProviderData();
    }, [username]);
 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
        setSuccessMessage(null);
    };
 
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setProfilePictureFile(file);
        setError(null);
        setSuccessMessage(null);
    };
 
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
 
        if (
            !editedFormData.providerName ||
            !editedFormData.location ||
            !editedFormData.mobileNumber ||
            !editedFormData.email ||
            !editedFormData.description ||
            editedFormData.experience === undefined ||
            editedFormData.experience < 0
        ) {
            setError("Provider Name, Location, Mobile Number, Email, Experience (must be non-negative), and Description are required.");
            setLoading(false);
            return;
        }
 
        const mobileNumberPattern = /^[0-9]{10,15}$/;
        if (!mobileNumberPattern.test(editedFormData.mobileNumber)) {
            setError("Mobile number must be 10-15 digits long and contain only numbers.");
            setLoading(false);
            return;
        }
 
        const dataToSend: any = { ...editedFormData };
        // Re-encode description to base64 if it's being sent to the backend as such
        if (editedFormData.description) {
            dataToSend.description = btoa(unescape(encodeURIComponent(editedFormData.description)));
        }
 
        try {
            if (profilePictureFile) {
                const reader = new FileReader();
                reader.readAsDataURL(profilePictureFile);
                await new Promise<void>((resolve, reject) => {
                    reader.onloadend = () => {
                        const base64StringWithPrefix = reader.result as string;
                        dataToSend.profilePicture = base64StringWithPrefix.split(',')[1];
                        resolve();
                    };
                    reader.onerror = (errorEvent) => {
                        console.error("FileReader error:", errorEvent);
                        setError("Failed to read profile picture file. Please try another image.");
                        setLoading(false);
                        reject(errorEvent);
                    };
                });
                if (error) return;
            } else {
                dataToSend.profilePicture = providerData?.profilePicture || null;
            }
 
            dataToSend.mobileNumber = parseInt(editedFormData.mobileNumber, 10);
            dataToSend.experience = Number(editedFormData.experience);
 
            dataToSend.service = providerData?.service;
 
            delete dataToSend.rating;
            delete dataToSend.noOfBookings;
            delete dataToSend.noOfTimesBooked;
 
            const res = await axios.put(
                `${API_BASE_URL}/provider/update-provider/${username}`,
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
 
            const updatedProviderRes = await axios.get<Provider>(
                `${API_BASE_URL}/provider/get-profile/${username}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setProviderData(updatedProviderRes.data);
            setEditedFormData({
                username: updatedProviderRes.data.username,
                providerName: updatedProviderRes.data.providerName,
                location: updatedProviderRes.data.location,
                mobileNumber: String(updatedProviderRes.data.mobileNumber),
                email: updatedProviderRes.data.email,
                profilePicture: updatedProviderRes.data.profilePicture,
                experience: updatedProviderRes.data.experience,
                description: decodeBase64ToString(updatedProviderRes.data.description), // Decode description again after successful update
            });
            setProfilePictureFile(null);
 
            setSuccessMessage(`Profile updated successfully!`);
            setIsEditing(false);
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'object' && !Array.isArray(err.response.data)) {
                    const errorMessages = Object.values(err.response.data).flat().join('\n');
                    setError(`Update failed: ${errorMessages}`);
                } else if (typeof err.response.data === 'string') {
                    setError(err.response.data);
                } else {
                    setError(err.response.data.message || 'Failed to update profile. Please try again.');
                }
            } else {
                setError(err.message || 'Failed to update profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
 
    const handleCancelEdit = () => {
        setIsEditing(false);
        if (providerData) {
            setEditedFormData({
                username: providerData.username,
                providerName: providerData.providerName,
                location: providerData.location,
                mobileNumber: String(providerData.mobileNumber),
                email: providerData.email,
                profilePicture: providerData.profilePicture,
                experience: providerData.experience,
                description: decodeBase64ToString(providerData.description), // Decode here on cancel
            });
        }
        setProfilePictureFile(null);
        setError(null);
        setSuccessMessage(null);
    };
 
    if (loading && !providerData) {
        return <div className="text-center text-gray-600 p-8">Loading profile...</div>;
    }
 
    if (error && !providerData) {
        return <div className="text-center text-red-600 p-8 flex items-center justify-center"><AlertTriangle className="inline h-5 w-5 mr-2" />{error}</div>;
    }
 
    if (!providerData) {
        return <div className="text-center text-gray-600 p-8">No provider data available.</div>;
    }
 
    return (
        <div className="bg-white rounded-xl p-6 shadow-md space-y-6 max-w-2xl mx-auto">
            <form onSubmit={handleSaveProfile}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Your Profile Information</h3>
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Edit className="h-5 w-5" />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>
 
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <AlertTriangle className="inline h-4 w-4 mr-2" />
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <CheckCircle className="inline h-4 w-4 mr-2" />
                        <span className="block sm:inline">{successMessage}</span>
                    </div>
                )}
 
                <div className="flex items-center space-x-6 mb-6">
                    <img
                        src={
                            profilePictureFile
                                ? URL.createObjectURL(profilePictureFile)
                                : (providerData.profilePicture ? `data:image/jpeg;base64,${providerData.profilePicture}` : "https://via.placeholder.com/150")
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                    />
                    <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="providerName"
                                    value={editedFormData.providerName || ''}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-lg font-semibold w-full focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            ) : providerData.providerName}
                        </h4>
                        <p className="text-gray-600 flex items-center mt-1 text-sm">
                            <User className="h-4 w-4 mr-1 text-gray-500" />
                            {providerData.username}
                        </p>
                        <p className="text-gray-600 flex items-center text-sm">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            Ratings : {providerData.rating || 'N/A'} {providerData.noOfBookings}
                        </p>
                    </div>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700">
                    <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                        <p className="flex-grow"><strong>Location:</strong> {isEditing ? (
                            <input
                                type="text"
                                name="location"
                                value={editedFormData.location || ''}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        ) : providerData.location}</p>
                    </div>
                    <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-blue-500" />
                        <p className="flex-grow"><strong>Mobile:</strong> {isEditing ? (
                            <input
                                type="text"
                                name="mobileNumber"
                                value={editedFormData.mobileNumber || ''}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
                                pattern="[0-9]{10,15}"
                                title="Mobile number must be 10-15 digits long and contain only numbers."
                                required
                            />
                        ) : providerData.mobileNumber}</p>
                    </div>
                    <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-blue-500" />
                        <p className="flex-grow"><strong>Email:</strong> {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editedFormData.email || ''}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        ) : providerData.email || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                        <p><strong>Occupation:</strong> {providerData.service?.serviceName || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-blue-500" />
                        <p><strong>Experience:</strong> {isEditing ? (
                            <input
                                type="number"
                                name="experience"
                                value={editedFormData.experience === undefined ? '' : editedFormData.experience}
                                onChange={handleChange}
                                min="0"
                                max="50"
                                className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        ) : providerData.experience} years</p>
                    </div>
                    {isEditing && (
                        <div className="col-span-1 md:col-span-2"> {/* Make file input span two columns for better layout */}
                            <label htmlFor="profilePictureInput" className="block text-sm font-medium text-gray-700 mt-2">
                                Update Profile Picture
                            </label>
                            <input
                                type="file"
                                id="profilePictureInput"
                                name="profilePicture"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                accept="image/*"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Select a new image to update the profile picture.
                            </p>
                        </div>
                    )}
                </div>
 
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">About Me:</h4>
                    <p className="text-gray-700">{isEditing ? (
                        <textarea
                            name="description"
                            value={editedFormData.description || ''}
                            onChange={handleChange}
                            rows={4}
                            className="border border-gray-300 rounded-md w-full p-3 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    ) : decodeBase64ToString(providerData.description) || 'No description provided.'}</p> {/* Decode here for display */}
                </div>
 
                {isEditing && (
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex justify-center py-2 px-5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <XCircle className="h-5 w-5 mr-2" /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-5 w-5 mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>
 
            <div className="mt-8 border-t pt-6 border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-5 rounded-lg shadow-sm flex items-center justify-between border border-blue-200">
                        <div>
                            <p className="text-sm text-blue-800 font-medium">Total Bookings</p>
                            <p className="text-3xl font-extrabold text-blue-900 mt-1">{providerData.noOfBookings}</p>
                        </div>
                        <CheckCircle className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="bg-green-50 p-5 rounded-lg shadow-sm flex items-center justify-between border border-green-200">
                        <div>
                            <p className="text-sm text-green-800 font-medium">Times Booked by Unique Customers</p>
                            <p className="text-3xl font-extrabold text-green-900 mt-1">{providerData.noOfTimesBooked}</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-green-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default ProviderProfileInfo;
 