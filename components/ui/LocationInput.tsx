"use client";

import { useState, useMemo } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

type LocationInputProps = {
  value?: string;
  onChangeAction: (address: string, lat?: number, lng?: number) => void;
};

const LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export default function LocationInput({
  value,
  onChangeAction,
}: LocationInputProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: LIBRARIES,
  });

  const [address, setAddress] = useState(value || "");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const handleSelect = async (selected: string) => {
    try {
      const results = await geocodeByAddress(selected);
      const { lat, lng } = await getLatLng(results[0]);
      setAddress(selected);
      setPosition({ lat, lng });
      onChangeAction(selected, lat, lng);
    } catch (error) {
      console.error("Error selecting location:", error);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="flex flex-col w-full">
      <PlacesAutocomplete
        value={address}
        onChange={(val) => setAddress(val)}
        onSelect={handleSelect}
        searchOptions={{ componentRestrictions: { country: ["tn"] } }}
        debounce={400}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Enter a location...",
                className:
                  "w-full border-none bg-transparent outline-none text-gray-800 placeholder:text-gray-400 focus:ring-0 truncate",
              })}
            />
            <div className="z-50 bg-white shadow-md rounded-md mt-2 max-h-60 overflow-y-auto">
              {loading && (
                <div className="p-2 text-sm text-gray-400">Loading...</div>
              )}
              {suggestions.map((s) => {
                const className = s.active
                  ? "p-2 bg-gray-100 cursor-pointer"
                  : "p-2 cursor-pointer";
                return (
                  <div
                    {...getSuggestionItemProps(s, { className })}
                    key={s.placeId}
                  >
                    {s.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      {position && (
        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <GoogleMap
            center={position}
            zoom={14}
            mapContainerStyle={{ width: "100%", height: "180px" }}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            <MarkerF position={position} />
          </GoogleMap>
        </div>
      )}
    </div>
  );
}
