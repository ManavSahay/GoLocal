import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Import the single, merged SignupInput component
import SignupInput from "./SignupInput";
import PasswordField from "./PasswordField";
import PhotoUpload from "./PhotoUpload";
import SelectOccupation from "./SignupProvider/fields/SelectOccupation";
import { ServiceType, ServiceTypes } from "../../types/ServiceTypes"; // Assuming ServiceType has serviceId and serviceName

interface SignupFormProps {
  role: "ROLE_CUSTOMER" | "ROLE_PROVIDER";
}

const SignupForm: React.FC<SignupFormProps> = ({ role }) => {
  const navigate = useNavigate();
  const { register, getAllService } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePictureBase64, setProfilePictureBase64] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for services (provider specific)
  const [services, setServices] = useState<ServiceTypes[]>([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "", // Will be customerName or providerName
    location: "",
    mobileNumber: "", // Keep as string for input and validation
    email: "",
    description: "", // Provider specific
    serviceId: "", // Provider specific, maps to service.id or service.serviceId
    experience: "", // Provider specific, keep as string from input
  });

  // Fetch services for providers when component mounts or role changes to provider
  useEffect(() => {
    if (role === "ROLE_PROVIDER") {
      const fetchServices = async () => {
        try {
          setServiceLoading(true);
          const data = await getAllService();
          setServices(data || []); // Ensure data is an array
          setServiceError(null);
        } catch (err) {
          console.error("Failed to fetch service categories:", err); // Added console.error
          setServiceError("Failed to load service categories.");
        } finally {
          setServiceLoading(false);
        }
      };
      fetchServices();
    }
    return () => {
      setServiceError(null);
      setServiceLoading(true);
      setServices([]);
    };
  }, [role, getAllService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (file: File | null, base64: string | null) => {
    setSelectedFile(file);
    setProfilePictureBase64(base64);
    if (base64 === null && file !== null) {
      setError("Failed to read image file.");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (
      !formData.username ||
      !formData.password ||
      !formData.name ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.location
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number starting with 6-9.");
      setLoading(false);
      return;
    }

    const form = new FormData();

    // --- Role-specific FormData construction ---
    if (role === "ROLE_CUSTOMER" ) {
      // For customers, append individual fields to FormData directly.
      // Backend RegisterCustomerRequest DTO expects these as direct form parts.
      form.append("username", formData.username);
      form.append("password", formData.password);
      form.append("location", formData.location);
      form.append("mobileNumber", formData.mobileNumber); // Backend DTO expects Long, but will parse from String form field
      form.append("email", formData.email);
      form.append("isDeleted", "false"); // Send as string "false" for boolean in backend
      form.append("customerName", formData.name); // Use formData.name for customerName
      form.append("role", "ROLE_CUSTOMER");

      // For profile picture for customers: backend DTO expects a String (likely base64).
      if (profilePictureBase64) {
        form.append("profilePicture", profilePictureBase64); // Send the base64 string
      } else {
        // If no picture, send a default placeholder string or empty string
        form.append("profilePicture", "default_customer.png"); // Or "" if backend allows null/empty string
      }
    } else if (role === "ROLE_PROVIDER") {
      // Validation for provider-specific fields
      if (!formData.experience || !formData.description || !formData.serviceId) {
        setError("Please fill in all required provider-specific fields.");
        setLoading(false);
        return;
      }

      const service = services?.find((s) => s.serviceId === formData.serviceId);
      if (!service) {
        setError("Invalid service selection.");
        setLoading(false);
        return;
      }

      // Backend expects a flat set of fields, including the profilePicture as a String,
      // and mobileNumber/experience as numbers but potentially validated with @NotBlank.
      // We will send them as numbers in the JSON.
      const providerRequestData = {
        username: formData.username,
        password: formData.password,
        isDeleted: false, // Send as boolean false in JSON
        role: role, // Send role as a string, backend should map to enum
        providerName: formData.name, // Use formData.name for providerName
        location: formData.location,
        mobileNumber: parseInt(formData.mobileNumber), // Convert to number for JSON
        email: formData.email,
        experience: parseInt(formData.experience), // Convert to number for JSON
        description: formData.description,
        service: {
          serviceId: service.serviceId,
          serviceName: service.serviceName,
        },
        // --- CHANGE START ---
        // Profile picture MUST be included in the JSON payload as a Base64 string
        // because the DTO has `private String profilePicture;` with `@NotBlank`.
        profilePicture: profilePictureBase64 || "default_provider.png", // Provide a default if no picture
        // --- CHANGE END ---
      };

      // --- CHANGE START ---
      // Append the provider data directly to FormData as individual fields.
      // This is because your DTOs extend RegisterRequest and expect a flat structure,
      // not a nested JSON blob under a key like "providerRequest".
      // Also, the backend uses @NotBlank on Long and int fields, which suggests
      // it's trying to parse them as strings before conversion, or the validation
      // is simply misconfigured on the backend. Sending them as numbers in the JSON
      // is the correct way for JSON, and if it fails, the backend is truly expecting string.

      form.append("username", providerRequestData.username);
      form.append("password", providerRequestData.password);
      form.append("isDeleted", String(providerRequestData.isDeleted)); // Convert boolean to string "true"/"false"
      form.append("role", providerRequestData.role); // Send enum as string "ROLE_PROVIDER"
      form.append("providerName", providerRequestData.providerName);
      form.append("location", providerRequestData.location);
      // For mobileNumber and experience, send as string to satisfy `@NotBlank` if it applies to the string representation before parsing.
      // If backend truly expects Long/int from the form field directly, it will parse.
      // This is the most *flexible* approach when backend DTOs are weirdly annotated.
      form.append("mobileNumber", String(providerRequestData.mobileNumber)); // Send as string
      form.append("email", providerRequestData.email);
      form.append("experience", String(providerRequestData.experience)); // Send as string
      form.append("description", providerRequestData.description);
      form.append("profilePicture", providerRequestData.profilePicture); // Send the Base64 string

      // For nested ServiceEntity, backend usually expects its fields directly.
      // If ServiceEntity has serviceId and serviceName, append them as:
      form.append("service.serviceId", String(providerRequestData.service.serviceId)); // Assuming serviceId is a number
      form.append("service.serviceName", providerRequestData.service.serviceName);

      // Remove the separate file append for profilePicture
      // if (selectedFile) {
      //   form.append("profilePicture", selectedFile);
      // }
      // --- CHANGE END ---
    }

    try {
      console.log("FormData for submission:");
      for (let pair of form.entries()) {
          console.log(pair[0] + ': ', pair[1]);
      }

      const success = await register(form, role);

      if (success) {
        alert("Registration successful! Welcome to Go Local.");
        if (role === "ROLE_CUSTOMER") {
          navigate("/customer-dashboard");
        } else if (role === "ROLE_PROVIDER") {
          navigate("/provider-dashboard");
        }
      } else {
        setError("Registration failed. Please check your details and try again.");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Registration failed due to an unexpected error.";
      console.error("Registration error:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 text-center bg-red-100 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Full Name / Provider Name & Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SignupInput
          id="name"
          label={role === "ROLE_CUSTOMER" ? "Full Name" : "Provider Name"}
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder={role === "ROLE_CUSTOMER" ? "Your full name" : "Business name"}
          required
        />
        <SignupInput
          id="mobileNumber"
          label="Mobile Number"
          name="mobileNumber"
          type="tel"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          required
          pattern="^[6-9]\d{9}$" // Client-side pattern for 10 digits starting with 6-9
          maxLength={10}
        />
      </div>

      {/* Email & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SignupInput
          id="email"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          required
        />
        <SignupInput
          id="location"
          label="Location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="City or Area"
          required
        />
      </div>

      {/* Username & Photo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SignupInput
          id="username"
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Unique username"
          required
        />
        <PhotoUpload
          id="profilePicture"
          name="profilePicture"
          onPhotoChange={handlePhotoUpload}
          fileName={selectedFile?.name || null}
          previewBase64={profilePictureBase64}
        />
      </div>

      {/* Provider-specific fields */}
      {role === "ROLE_PROVIDER" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectOccupation
            id="serviceId"
            name="serviceId"
            label="Service Category"
            value={formData.serviceId}
            onChange={handleChange}
            loading={serviceLoading}
            error={serviceError}
            options={services}
            required
          />
          <SignupInput
            id="experience"
            label="Years of Experience"
            name="experience"
            type="number" // Use type "number" for numeric input
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g., 3"
            required
            min="0" // HTML5 min attribute
            max="50" // HTML5 max attribute
          />
        </div>
      )}

      {/* Description (Provider-specific) */}
      {role === "ROLE_PROVIDER" && (
        <div>
          <SignupInput // Use the unified SignupInput for textarea
            id="description"
            label="Service Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your services and experience"
            required
            isTextArea={true} // Crucial: tell it to render a textarea
            rows={3}
          />
        </div>
      )}

      {/* Password Field */}
      <PasswordField
        id="password"
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword((prev) => !prev)}
        placeholder="Create a strong password"
        required
      />

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Registering..." : `Register as ${role === "ROLE_CUSTOMER" ? "Customer" : "Service Provider"}`}
      </button>
    </form>
  );
};

export default SignupForm;