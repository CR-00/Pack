import { MapContainer, TileLayer } from "react-leaflet";
import openStreetMapLayers from "../lib/openStreetMapLayers";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";


export default function MapPreview({ centerPoint, style, zoomable=false, dragging=false }) {
  return (
   
      <MapContainer
        center={centerPoint}
        zoom={10}
        zoomControl={zoomable}
        scrollWheelZoom={false}
        dragging={dragging}
        style={style}
      >
        <TileLayer url={openStreetMapLayers["standard"]} />
      </MapContainer>
  
  );
}
