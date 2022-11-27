import { MapContainer, TileLayer } from "react-leaflet";
import openStreetMapLayers from "../lib/openStreetMapLayers";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export default function MapPreview({ centerPoint }) {
    return (
    <MapContainer
      center={centerPoint}
      zoom={5}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      style={{ height: "250px", width: "350px", zIndex: "0" }}
    >
      <TileLayer url={openStreetMapLayers["standard"]} />
    </MapContainer>
  );
}
