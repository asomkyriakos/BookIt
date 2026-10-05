import { useEffect, useRef, useState } from "react";
import {
  Map as LeafletMap,
  type LeafletMouseEvent,
  Marker,
  Icon,
  map,
  marker,
  tileLayer,
} from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIconUrl from "../../../node_modules/leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "../../../node_modules/leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "../../../node_modules/leaflet/dist/images/marker-shadow.png";


interface Location {
  label: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface EventLocationPickerProps {
  idPrefix: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (location: Pick<Location, "latitude" | "longitude">) => void;
  onLocationSelect: (location: Location) => void;
}

const defaultMapCenter: [number, number] = [37.9838, 23.7275];
let lastSearchAt = 0;

async function geocodeAddress(address: string): Promise<Location[]> {
  const cacheKey = `event-geocode:v2:${address.toLowerCase()}`;
  const cachedResults = window.localStorage.getItem(cacheKey);

  if (cachedResults) return JSON.parse(cachedResults) as Location[];

  const waitTime = Math.max(0, 1000 - (Date.now() - lastSearchAt));
  if (waitTime) await new Promise((resolve) => window.setTimeout(resolve, waitTime));

  lastSearchAt = Date.now();
  const parameters = new URLSearchParams({ q: address, format: "jsonv2", addressdetails: "1", limit: "5" });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${parameters}`);

  if (!response.ok) throw new Error("Could not search for that address.");

  const results = (await response.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    address?: {
      house_number?: string;
      road?: string;
      pedestrian?: string;
      footway?: string;
      path?: string;
      suburb?: string;
      city?: string;
      town?: string;
      village?: string;
      municipality?: string;
      county?: string;
      country?: string;
    };
  }>;
  const locations = results.map((result) => ({
    label: result.display_name,
    address: [result.address?.house_number, result.address?.road ?? result.address?.pedestrian ?? result.address?.footway ?? result.address?.path]
      .filter(Boolean)
      .join(" ") || result.address?.suburb || "",
    city: result.address?.city
      ?? result.address?.town
      ?? result.address?.village
      ?? result.address?.municipality
      ?? result.address?.county
      ?? "",
    country: result.address?.country ?? "",
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  }));

  window.localStorage.setItem(cacheKey, JSON.stringify(locations));
  return locations;
}

export default function EventLocationPicker({
  idPrefix,
  address,
  latitude,
  longitude,
  onLocationChange,
  onLocationSelect,
}: EventLocationPickerProps) {

  // fix for leaflet marker
  Icon.Default.prototype.options.iconUrl = markerIconUrl;
  Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
  Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
  Icon.Default.imagePath = ""; // necessary to avoid Leaflet adds some prefix to image path.


  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const locationChangeRef = useRef(onLocationChange);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Location[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    locationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const locationMap = map(mapContainerRef.current).setView(defaultMapCenter, 12);
    tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(locationMap);
    locationMap.on("click", (event: LeafletMouseEvent) => {
      locationChangeRef.current({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    });
    mapRef.current = locationMap;

    setTimeout(() => {
      locationMap.invalidateSize();         //remember location in order to edit later
    }, 100);

    return () => {
      locationMap.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const locationMap = mapRef.current;
    if (!locationMap) return;

    if (latitude === null || longitude === null) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const position: [number, number] = [latitude, longitude];
    if (!markerRef.current) {
      markerRef.current = marker(position, { draggable: true }).addTo(locationMap);
      markerRef.current.on("dragend", () => {
        const position = markerRef.current?.getLatLng();
        if (position) locationChangeRef.current({ latitude: position.lat, longitude: position.lng });
      });
    } else {
      markerRef.current.setLatLng(position);
    }
    locationMap.setView(position, 16)
  }, [latitude, longitude]);




  async function findLocation() {
    if (!address) {
      setMessage("Enter an address, city, or country first.");
      return;
    }

    setIsSearching(true);
    setResults([]);
    setMessage("");

    try {
      const locations = await geocodeAddress(address);
      setResults(locations);
      if (!locations.length) setMessage("No matching location was found.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not search for that address.");
    } finally {
      setIsSearching(false);
    }
  }

  function selectLocation(location: Location) {
    onLocationSelect(location);
    mapRef.current?.setView([location.latitude, location.longitude], 16);
    setResults([]);
    setMessage("Location selected. Drag the pin or click the map to refine it.");
  }

  const coordinatesText = latitude !== null && longitude !== null
    ? `Saved coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    : "No location selected yet. You can also click directly on the map.";

  return (
    <fieldset className="location-picker">
      <legend>Event location</legend>
      <p className="field-hint">Search after completing the address fields, then confirm the pin on the map.</p>
      <button type="button" className="button button--secondary" onClick={() => void findLocation()} disabled={isSearching}>
        {isSearching ? "Finding location..." : "Find on map"}
      </button>
      {results.length ? (
        <div className="location-results" aria-label="Address search results">
          {results.map((result) => (
            <button key={`${result.latitude}-${result.longitude}`} type="button" className="location-result" onClick={() => selectLocation(result)}>
              {result.label}
            </button>
          ))}
        </div>
      ) : null}
      <div ref={mapContainerRef} id={`${idPrefix}-location-map`} className="event-location-map" />
      <small className="field-hint">
        {coordinatesText}
      </small>
      {message ? <p className="location-message" role="status">{message}</p> : null}
    </fieldset>
  );
}
