import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC, useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { ISheet, ILocationPayload, ILocation } from "@/types";
import { locationSchema } from "@/utils/validation";
import CustomButton from "@/components/CustomButton";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";
import useMessage from "@/hooks/useMessage";
import useCreateLocation from "@/hooks/useCreateLocation";
import useUpdateLocation from "@/hooks/useUpdateLocation";
import { loadGoogleMapsAPI, COUNTRIES } from "@/utils/api";
import { MapPin, Search, Navigation, Info, RefreshCcw } from "lucide-react";
import { nanoid } from 'nanoid';

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

interface GoogleMapsRefs {
  map: HTMLDivElement | null;
  search: HTMLInputElement | null;
  mapInstance: any;
  markerInstance: any;
  autocompleteInstance: any;
}

const CreateLocationModal: FC<ISheet<ILocation>> = ({ isOpen, onClose, data }) => {
  const newData = data as ILocation;
  const message = useMessage();
  const { mutate: createMutate, isPending: isCreating } = useCreateLocation();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateLocation(newData?.id ?? '');

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [hasSearchedLocation, setHasSearchedLocation] = useState(false);

  const refs = useRef<GoogleMapsRefs>({
    map: null,
    search: null,
    mapInstance: null,
    markerInstance: null,
    autocompleteInstance: null,
  });

  const isInitialLoad = useRef(true);

  const form = useForm<ILocationPayload>({
    mode: "onChange",
    resolver: yupResolver(locationSchema) as any,
    defaultValues: {
      business_name: "",
      contact_number: "",
      address: "",
      city: "",
      country: "",
      referral_code: undefined,
      latitude: "",
      longitude: "",
    },
  });

  const generateReferralCode = () => {
    const code = `REF-${nanoid(8)}`;
    form.setValue("referral_code", code);
    message({ status: "success", message: `Generated referral code: ${code}` });
  };

  const parseGooglePlaceData = useCallback((place: any, coordinates?: { lat: number; lng: number }) => {
    const components = place.address_components || [];
    const geometry = place.geometry || {};
    const location = coordinates || {
      lat: geometry.location?.lat() || 0,
      lng: geometry.location?.lng() || 0,
    };

    const getComponent = (types: string[], useShortName = false) => {
      for (const type of types) {
        const component = components.find((comp: any) => comp.types.includes(type));
        if (component) {
          return useShortName ? component.short_name : component.long_name;
        }
      }
      return "";
    };

    const addressData = {
      fullAddress: place.formatted_address || "",
      city: getComponent(["locality", "administrative_area_level_2"]),
      country: getComponent(["country"], true),
      autoName: place.name || "",
    };

    form.setValue("address", addressData.fullAddress);
    form.setValue("city", addressData.city);
    form.setValue("country", COUNTRIES.find(c => c.code === addressData.country)?.code || "");
    form.setValue("latitude", location.lat.toString());
    form.setValue("longitude", location.lng.toString());

    const currentName = form.getValues("business_name");
    if (!currentName.trim() && addressData.autoName) {
      form.setValue("business_name", addressData.autoName);
    }

    message({ status: "success", message: `Address updated: ${addressData.fullAddress}` });
  }, [form, message]);

  const getZoomLevelForPlace = useCallback((place: any) => {
    const types = place.types || [];
    if (types.includes('country')) return 5;
    if (types.includes('administrative_area_level_1')) return 8;
    if (types.includes('locality')) return 13;
    if (types.includes('street_address')) return 17;
    return 14;
  }, []);

  const cleanupGoogleMaps = useCallback(() => {
    if (refs.current.markerInstance) refs.current.markerInstance.setMap(null);
    if (refs.current.autocompleteInstance) window.google?.maps?.event?.clearInstanceListeners(refs.current.autocompleteInstance);
    refs.current.markerInstance = null;
    refs.current.autocompleteInstance = null;
    refs.current.mapInstance = null;
    setHasSearchedLocation(false);
  }, []);

  const handleMapInteraction = useCallback(async (lat: number, lng: number) => {
    if (!refs.current.mapInstance || !window.google?.maps) return;

    setIsGeocoding(true);
    try {
      if (refs.current.markerInstance) {
        refs.current.markerInstance.setPosition({ lat, lng });
      } else {
        refs.current.markerInstance = new window.google.maps.Marker({
          position: { lat, lng },
          map: refs.current.mapInstance,
          draggable: true,
        });

        refs.current.markerInstance.addListener("dragend", (e: any) => {
          if (e.latLng) handleMapInteraction(e.latLng.lat(), e.latLng.lng());
        });
      }

      setHasSearchedLocation(true);

      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });

      if (response.results?.length > 0) {
        parseGooglePlaceData(response.results[0], { lat, lng });
      } else {
        form.setValue("latitude", lat.toString());
        form.setValue("longitude", lng.toString());
        message({ status: "info", message: "Coordinates set, address unavailable" });
      }
    } catch (error) {
      form.setValue("latitude", lat.toString());
      form.setValue("longitude", lng.toString());
      message({ status: "warning", message: "Address lookup failed" });
    } finally {
      setIsGeocoding(false);
    }
  }, [form, message, parseGooglePlaceData]);

  const updateMapView = useCallback((place: any) => {
    if (!refs.current.mapInstance || !place.geometry) return;

    const location = place.geometry.location;
    const lat = location.lat();
    const lng = location.lng();

    setHasSearchedLocation(true);

    if (refs.current.markerInstance) refs.current.markerInstance.setMap(null);

    if (place.geometry.viewport) {
      refs.current.mapInstance.fitBounds(place.geometry.viewport);
    } else {
      const zoom = getZoomLevelForPlace(place);
      refs.current.mapInstance.setCenter({ lat, lng });
      refs.current.mapInstance.setZoom(zoom);
    }

    setTimeout(() => {
      refs.current.markerInstance = new window.google.maps.Marker({
        position: { lat, lng },
        map: refs.current.mapInstance,
        draggable: true,
        title: place.formatted_address || place.name || "Location",
      });

      refs.current.markerInstance.addListener("dragend", (e: any) => {
        if (e.latLng) handleMapInteraction(e.latLng.lat(), e.latLng.lng());
      });
    }, 100);
  }, [getZoomLevelForPlace, handleMapInteraction]);

  const handleManualSearch = useCallback(async () => {
    const searchValue = refs.current.search?.value?.trim();
    if (!searchValue || !isGoogleMapsLoaded || !refs.current.mapInstance) return;

    setIsGeocoding(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address: searchValue });

      if (response.results?.length > 0) {
        const place = response.results[0];
        updateMapView(place);
        parseGooglePlaceData(place);
      } else {
        message({ status: "warning", message: "No results found" });
      }
    } catch (error) {
      message({ status: "error", message: "Search failed" });
    } finally {
      setIsGeocoding(false);
    }
  }, [isGoogleMapsLoaded, message, parseGooglePlaceData, updateMapView]);

  useEffect(() => {
    if (!isOpen) return;

    const loadAPI = async () => {
      try {
        await loadGoogleMapsAPI(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string);
        setIsGoogleMapsLoaded(true);
      } catch (error) {
        message({ status: "error", message: "Failed to load Google Maps" });
      }
    };

    if (isInitialLoad.current) {
      loadAPI();
      isInitialLoad.current = false;
    }
  }, [isOpen, message]);

  useEffect(() => {
    if (!isOpen || !isGoogleMapsLoaded || !refs.current.map || refs.current.mapInstance) return;

    let initialCenter = { lat: 20, lng: 0 };
    let initialZoom = 2;

    if (newData?.latitude && newData?.longitude) {
      const lat = parseFloat(newData.latitude);
      const lng = parseFloat(newData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        initialCenter = { lat, lng };
        initialZoom = 15;
        setHasSearchedLocation(true);
      }
    }

    const map = new window.google.maps.Map(refs.current.map, {
      center: initialCenter,
      zoom: initialZoom,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: false,
    });

    refs.current.mapInstance = map;

    if (newData?.latitude && newData?.longitude) {
      const lat = parseFloat(newData.latitude);
      const lng = parseFloat(newData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        refs.current.markerInstance = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          draggable: true,
        });

        refs.current.markerInstance.addListener('dragend', (e: any) => {
          if (e.latLng) handleMapInteraction(e.latLng.lat(), e.latLng.lng());
        });
      }
    }

    map.addListener("click", (e: any) => {
      if (e.latLng) handleMapInteraction(e.latLng.lat(), e.latLng.lng());
    });

    if (refs.current.search) {
      refs.current.autocompleteInstance = new window.google.maps.places.Autocomplete(refs.current.search, {
        fields: ["address_components", "geometry", "formatted_address", "name", "types"],
      });

      refs.current.autocompleteInstance.addListener("place_changed", () => {
        const place = refs.current.autocompleteInstance.getPlace();
        if (!place.geometry) {
          handleManualSearch();
          return;
        }
        updateMapView(place);
        parseGooglePlaceData(place);
      });
    }

    return cleanupGoogleMaps;
  }, [isOpen, isGoogleMapsLoaded, newData, handleMapInteraction, updateMapView, handleManualSearch, parseGooglePlaceData, cleanupGoogleMaps]);

  const onSubmit: SubmitHandler<ILocationPayload> = (inputs) => {
    const mutateFn = newData ? updateMutate : createMutate;
    const successMessage = newData ? "Location updated" : "Location created";

    mutateFn(inputs, {
      onSuccess: () => {
        message({ status: "success", message: successMessage });
        onClose();
      },
      onError: (error: any) => {
        message({ status: "error", message: error.message || "Operation failed" });
      },
    });
  };

  useEffect(() => {
    if (newData && isOpen) {
      form.reset({
        business_name: newData.business_name || "",
        contact_number: newData.contact_number || "",
        address: newData.address || "",
        city: newData.city || "",
        country: newData.country || "",
        referral_code: newData.referral_code,
        latitude: newData.latitude || "",
        longitude: newData.longitude || "",
      });
    } else if (isOpen) {
      form.reset({
        business_name: "",
        contact_number: "",
        address: "",
        city: "",
        country: "",
        referral_code: undefined,
        latitude: "",
        longitude: "",
      });
    }
  }, [newData, isOpen, form]);

  useEffect(() => {
    if (!isOpen) cleanupGoogleMaps();
  }, [isOpen, cleanupGoogleMaps]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg w-[900px] max-w-[95vw] max-h-[90vh] overflow-auto p-0 bg-white shadow-xl">
        <DialogHeader className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {newData ? "Edit Business Location" : "Create Business Location"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Search for any location to auto-populate the address, city, and country.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Fields Column */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  Business Information
                </h3>
                <div className="space-y-4">
                  <TextInput
                    label="Business Name"
                    isRequired
                    placeholder="e.g., Main Office"
                    {...form.register("business_name")}
                    error={form.formState.errors?.business_name}
                  />
                  <TextInput
                    label="Contact Number"
                    isRequired
                    placeholder="e.g., +1234567890"
                    {...form.register("contact_number")}
                    error={form.formState.errors?.contact_number}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Location Details
                </h3>
                <div className="space-y-4">
                  <TextInput
                    label="Complete Address"
                    isRequired
                    placeholder="Auto-filled from search"
                    {...form.register("address")}
                    error={form.formState.errors?.address}
                  />
                  <TextInput
                    label="City"
                    isRequired
                    placeholder="Auto-filled from search"
                    {...form.register("city")}
                    error={form.formState.errors?.city}
                  />
                  <Controller
                    name="country"
                    control={form.control}
                    render={({ field }) => (
                      <SelectInput
                        label="Country"
                        isRequired
                        error={form.formState.errors?.country}
                        onValueChange={field.onChange}
                        value={field.value}
                        options={COUNTRIES.map((country) => ({
                          inputDisplay: country.name,
                          value: country.code,
                        }))}
                        placeholder="Auto-selected from search"
                      />
                    )}
                  />
                  <div className="flex gap-2">
                    <TextInput
                      label="Referral Code"
                      placeholder="e.g., REF123"
                      {...form.register("referral_code")}
                      error={form.formState.errors?.referral_code}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={generateReferralCode}
                      className="mt-7 bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                  <input type="hidden" {...form.register("latitude")} />
                  <input type="hidden" {...form.register("longitude")} />
                </div>
              </div>
            </div>

            {/* Map Column */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Location Finder
                </h3>
                
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      ref={(el) => { refs.current.search = el; }}
                      type="text"
                      placeholder="Search: New York, Eiffel Tower..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      disabled={isGeocoding || !isGoogleMapsLoaded}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleManualSearch())}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleManualSearch}
                    disabled={isGeocoding || !isGoogleMapsLoaded}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {isGeocoding ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {isGeocoding ? "Searching..." : "Search"}
                  </button>
                </div>
                
                <div className="w-full h-[300px] bg-gray-100 rounded-lg border border-gray-300 overflow-hidden relative">
                  <div ref={(el) => { refs.current.map = el }} className="w-full h-full" />
                  {!isGoogleMapsLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Tips for using the map:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Search and press Enter or click Search</li>
                      <li>Click on the map to set a location</li>
                      <li>Drag the marker to adjust the position</li>
                      <li>Address fields will auto-populate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button 
              onClick={onClose} 
              variant="outline" 
              type="button" 
              className="border-gray-300 hover:bg-gray-50 px-5"
            >
              Cancel
            </Button>
            <CustomButton 
              type="submit" 
              isLoading={isCreating || isUpdating}
              disabled={isGeocoding}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2"
            >
              {newData ? "Update Location" : "Create Location"}
            </CustomButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLocationModal;