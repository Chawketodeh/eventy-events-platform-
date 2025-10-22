"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

type EventMapProps = {
  lat: number;
  lng: number;
};

export default function EventMap({ lat, lng }: EventMapProps) {
  //  Load the Google Maps API once
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <GoogleMap
        center={{ lat, lng }}
        zoom={14}
        mapContainerStyle={{ width: "100%", height: "250px" }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <MarkerF position={{ lat, lng }} />
      </GoogleMap>
    </div>
  );
}
