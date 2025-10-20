// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback, // Import useCallback
} from "react";
import axios from "axios";
import { ServiceType,ServiceTypes } from "../types/ServiceTypes";

interface User {
  username: string;
  password?: string; // Password is not usually kept in client-side user object
  role: string;
  isDeleted: string;
  customerName?: string;
  email?: string;
  mobileNumber?: string;
  location?: string;
  rating?: number;
  noOfBookings?: number;
  profilePicture?: string;
  providerId?: string;
  providerName?: string;
  description?: string;
  serviceCategory?: string;
  availableFrom?: string;
  availableTo?: string;
  servicesOffered?: string[];
  adminId?: string;
  adminName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  token: string | null; // Added token to context
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (formData: any, role: "ROLE_CUSTOMER" | "ROLE_PROVIDER") => Promise<boolean>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getAllServices: () => Promise<ServiceType[] | null>;
  getAllService:() => Promise<ServiceTypes[] | null>;
  refreshUser: () => Promise<void>; // Added refreshUser function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token")); // Initialize token from localStorage

  const fetchUserProfile = useCallback(
    async (username: string, role: string, authToken: string): Promise<User | null> => {
      try {
        console.log(`AuthContext: Fetching profile for ${username} with role ${role}`);
        let profileApiUrl = "";
        if (role === "ROLE_ADMIN") {
          // If it's an ADMIN, we don't need to fetch a separate profile API.
          // Just return a basic user object with essential info from login.
          console.log("AuthContext: Admin role detected, skipping detailed profile fetch.");
          return { username, role, isDeleted: "false", adminName: username }; // You might need to adjust 'isDeleted' and 'adminName' based on your actual User type's requirements for an admin.
        } 
        if (role === "ROLE_CUSTOMER") {
          profileApiUrl = `http://localhost:8080/api/customer/get-profile/${username}`;
        } else if (role === "ROLE_PROVIDER") {
          profileApiUrl = `http://localhost:8080/api/provider/get-profile/${username}`;
        }else {
          console.error("AuthContext: Unknown user role during profile fetch:", role);
          return null;
        }

        const profileRes = await axios.get<User>(profileApiUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log("AuthContext: Profile response data:", profileRes.data);
        const mobileNumber = profileRes.data.mobileNumber ? String(profileRes.data.mobileNumber) : undefined;
        // Merge fetched data with essential stored data (username, role)
        return { ...profileRes.data, username: username, role: role, mobileNumber };
      } catch (error) {
        console.error("AuthContext: Failed to fetch full profile:", error);
        return null;
      }
    },
    []
  ); // Dependencies for useCallback - none as it depends on its arguments

  // Function to refresh the user data in context
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    const currentUsername = localStorage.getItem("username");
    const currentRole = localStorage.getItem("role");

    if (currentToken && currentUsername && currentRole) {
      setLoading(true);
      const fullProfileData = await fetchUserProfile(currentUsername, currentRole, currentToken);
      if (fullProfileData) {
        setUser(fullProfileData);
        console.log("AuthContext: User profile refreshed successfully.");
      } else {
        console.warn("AuthContext: Failed to refresh user profile. Logging out.");
        logout(); // Logout if refresh fails
      }
      setLoading(false);
    } else {
      console.log("AuthContext: No token or username found for refresh, doing nothing.");
    }
  }, [fetchUserProfile]); // Depends on fetchUserProfile

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("username");
      const storedRole = localStorage.getItem("role");
      console.log("Auth Context Init:", storedToken, storedUsername, storedRole);

      if (storedToken && storedUsername && storedRole) {
        setToken(storedToken); // Set token state
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        try {
          const fullProfileData = await fetchUserProfile(
            storedUsername,
            storedRole,
            storedToken
          );
          if (fullProfileData) {
            setUser(fullProfileData);
            console.log("AuthContext: Auto-login successful with full profile data.");
          } else {
            console.warn(
              "AuthContext: Failed to get full profile during auto-login. Clearing session."
            );
            logout();
          }
        } catch (error) {
          console.error("AuthContext: Error during auto-login profile fetch:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [fetchUserProfile]); // Add fetchUserProfile to dependencies

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      const { accessToken, role } = response.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      console.log("AuthContext login: Stored username:", localStorage.getItem("username")); // Add this
      console.log("AuthContext login: Stored role:", localStorage.getItem("role")); // Add this
      setToken(accessToken); // Set token state
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const fullUserData = await fetchUserProfile(username, role, accessToken);
      if (fullUserData) {
        setUser(fullUserData);
        console.log("AuthContext: Manual login successful, user set:", fullUserData);
        return true;
      } else {
        console.error("AuthContext: Failed to get full profile after manual login.");
        logout();
        return false;
      }
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null); // Clear token state
    setUser(null);
    console.log("AuthContext: User logged out.");
  };

  const register = async (
    payload: any, // This is now a plain object, not FormData
    role: "ROLE_CUSTOMER" | "ROLE_PROVIDER"
): Promise<boolean> => {
    try {
        let endpoint = "http://localhost:8080/api/auth/register-customer";
        if (role === "ROLE_PROVIDER") {
            endpoint = "http://localhost:8080/api/auth/register-provider";
        }
        console.log(endpoint, " : ", payload);
        const response = await axios.post(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json' // Explicitly set for clarity
            }
        });
        console.log("AuthContext: Registration successful.", response);
        return true;
    } catch (error) {
        console.error("AuthContext: Registration failed:", error);
        return false;
    }
};

  const getAllServices = async (): Promise<ServiceType[] | null> => {
    try {
      const response = await axios.get<ServiceType[]>(
        "http://localhost:8080/api/auth/get-providers"
      );
      console.log("AuthContext: Fetched all services:", response.data);
      return response.data;
    } catch (error) {
      console.error("AuthContext: Failed to fetch services:", error);
      return null;
    }
  };

  const getAllService = async (): Promise<ServiceTypes[] | null> => {
    try {
      const response = await axios.get<ServiceTypes[]>(
        "http://localhost:8080/api/auth/get-all-services"
      );
      console.log("AuthContext: Fetched all services:", response.data);
      return response.data;
    } catch (error) {
      console.error("AuthContext: Failed to fetch services:", error);
      return null;
    }
  };


  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    token, // Provide token
    login,
    logout,
    register,
    setUser,
    getAllServices,
    getAllService,
    refreshUser, // Provide refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
