import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface FilterState {
  search: string;
  location: string;
  category: string;
  priceRange: string;
  rating: string;
  availability: string;
  distance: string;
  sortBy: string;
}

interface FilterContextType {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  applyFilters: (services: any[]) => any[];
}

const defaultFilters: FilterState = {
  search: "",
  location: "",
  category: "",
  priceRange: "",
  rating: "",
  availability: "",
  distance: "",
  sortBy: "rating",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const applyFilters = useCallback(
    (services: any[]) => {
      let filteredServices = [...services];

      // Search filter
      if (filters.search) {
        filteredServices = filteredServices.filter(
          (service) =>
            service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            service.category
              .toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            service.description
              .toLowerCase()
              .includes(filters.search.toLowerCase()),
        );
      }

      // Location filter
      if (filters.location) {
        filteredServices = filteredServices.filter((service) =>
          service.location
            .toLowerCase()
            .includes(filters.location.toLowerCase()),
        );
      }

      // Category filter
      if (filters.category && filters.category !== "All Services") {
        filteredServices = filteredServices.filter(
          (service) =>
            service.category.toLowerCase() === filters.category.toLowerCase(),
        );
      }

      // Price range filter
      if (filters.priceRange) {
        filteredServices = filteredServices.filter((service) => {
          const price = parseInt(service.price.replace(/[^\d]/g, ""));
          switch (filters.priceRange) {
            case "Under ₹500":
              return price < 500;
            case "₹500 - ₹800":
              return price >= 500 && price <= 800;
            case "Over ₹800":
              return price > 800;
            default:
              return true;
          }
        });
      }

      // Rating filter
      if (filters.rating) {
        filteredServices = filteredServices.filter((service) => {
          const rating = service.rating;
          switch (filters.rating) {
            case "4+ Stars":
              return rating >= 4;
            case "4.5+ Stars":
              return rating >= 4.5;
            case "5 Stars":
              return rating === 5;
            default:
              return true;
          }
        });
      }

      // Availability filter
      if (filters.availability) {
        switch (filters.availability) {
          case "Available Now":
            filteredServices = filteredServices.filter(
              (service) => service.available === true,
            );
            break;
          case "Available Today":
            filteredServices = filteredServices.filter(
              (service) => service.available === true,
            );
            break;
          default:
            break;
        }
      }

      // Sort services
      filteredServices.sort((a, b) => {
        switch (filters.sortBy) {
          case "rating":
            return b.rating - a.rating;
          case "price":
            const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
            const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
            return priceA - priceB;
          case "reviews":
            return b.reviews - a.reviews;
          case "experience":
            const expA = parseInt(a.experience.replace(/[^\d]/g, ""));
            const expB = parseInt(b.experience.replace(/[^\d]/g, ""));
            return expB - expA;
          default:
            return 0;
        }
      });

      return filteredServices;
    },
    [filters],
  );

  const value: FilterContextType = {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
