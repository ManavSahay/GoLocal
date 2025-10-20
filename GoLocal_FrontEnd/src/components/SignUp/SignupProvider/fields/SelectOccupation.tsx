import React from 'react';
import { Briefcase } from 'lucide-react';
import { ServiceType, ServiceTypes } from '../../../../types/ServiceTypes';

interface SelectOccupationProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    loading: boolean;
    error: string | null;
    options: ServiceTypes[];
    required?: boolean;
}

const SelectOccupation: React.FC<SelectOccupationProps> = ({
    id,
    name,
    label,
    value,
    onChange,
    loading,
    error,
    options,
    required,
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                    key={id}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white/80"
                    disabled={loading}
                >
                    <option value="">
                        {loading ? "Loading services..." : "Select your service"}
                    </option>
                    {error && <option value="" disabled>{error}</option>}
                    {!loading && !error && options.length === 0 && (
                        <option value="" disabled>No services available</option>
                    )}
                    {options.map((service) => (
                        <option key={service.serviceId} value={service.serviceId}>
                            {service.serviceName}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SelectOccupation;