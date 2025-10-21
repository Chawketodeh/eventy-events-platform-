"use client";

import { GoogleMap, MarkerF, LoadScript } from "@react-google-maps/api";

type EventMapProps = {
  lat: number;
  lng: number;
};

export default function EventMap({ lat, lng }: EventMapProps) {
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
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
      </LoadScript>
    </div>
  );
}
