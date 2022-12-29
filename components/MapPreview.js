import { MapContainer, TileLayer } from "react-leaflet";
import openStreetMapLayers from "../lib/openStreetMapLayers";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";


export default function MapPreview({ centerPoint, style }) {
  return (
   
      <MapContainer
        center={centerPoint}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        style={style}
      >
        <TileLayer url={openStreetMapLayers["standard"]} />
      </MapContainer>
  
  );
}
