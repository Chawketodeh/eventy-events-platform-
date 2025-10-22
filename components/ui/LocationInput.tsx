"use client";

import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

type LocationInputProps = {
  value?: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
};

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const [isReady, setIsReady] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const {
    ready,
    value: inputValue,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    debounce: 400,
    initOnMount: false,
    requestOptions: { componentRestrictions: { country: ["tn"] } },
  });

  // ✅ Wait until Google Maps is ready before initializing autocomplete
  useEffect(() => {
    const waitForMaps = () => {
      if (typeof window !== "undefined" && window.google?.maps?.places) {
        setIsReady(true);
        init();
      } else {
        setTimeout(waitForMaps, 300);
      }
    };
    waitForMaps();
  }, [init]);

  // ✅ Keep input synced with parent form value
  useEffect(() => {
    if (value && value !== inputValue) setValue(value, false);
  }, [value]);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);

      //  Save coordinates locally
      setPosition({ lat, lng });

      //  Send to parent form (EventForm)
      console.log("📍 Selected:", address, lat, lng);
      onChange(address, lat, lng);
    } catch (error) {
      console.error("Error getting geocode:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={inputValue}
          onChange={(e) => setValue(e.target.value)}
          disabled={!isReady || !ready}
          placeholder={
            isReady ? "Enter a location..." : "Loading Google Maps..."
          }
          className="w-full border-none bg-transparent outline-none text-gray-800 placeholder:text-gray-400 focus:ring-0 truncate"
        />

        <ComboboxPopover className="z-50 bg-white shadow-md rounded-md mt-2">
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>

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
