// Do not define ILocationPayload here.
// Instead, import it from the validation file as the single source of truth.
import { ILocationPayload } from "@/utils/validation";

export interface ILocation {
  id: string;
  business_name: string;
  contact_number: string;
  address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  referral_code?: string;
}

// Re-export the type so it's available throughout your application
export type { ILocationPayload };

export interface ISheet<T> {
  isOpen: boolean;
  onClose: () => void;
  data?: T;
}