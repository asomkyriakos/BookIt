import { useEffect } from "react";
import { map, tileLayer, marker, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIconUrl from "../../node_modules/leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "../../node_modules/leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "../../node_modules/leaflet/dist/images/marker-shadow.png";


interface EventMapProps {
  latitude: number;
  longitude: number;
  title: string;
}


export default function EventMap({
  latitude,
  longitude,
  title
}: EventMapProps) {

  // fix for leaflet marker
  Icon.Default.prototype.options.iconUrl = markerIconUrl;
  Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
  Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
  Icon.Default.imagePath = ""; // necessary to avoid Leaflet adds some prefix to image path.


  useEffect(() => {

    const myMap = map("event-map").setView(
      [latitude, longitude],
      14
    );


    tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          "&copy; OpenStreetMap contributors"
      }
    ).addTo(myMap);


    marker([latitude, longitude])
      .addTo(myMap)
      .bindPopup(title)
      .openPopup();


    return () => {
      myMap.remove();
    };


  }, [latitude, longitude, title]);


  return <div id="event-map" />;
}
