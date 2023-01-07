import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import {
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconMapPin, IconMapPinOff, IconX } from "@tabler/icons";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import roundLatLng from "../lib/roundLatLng";
import openStreetMapLayers from "../lib/openStreetMapLayers";
import _ from "lodash";

function Route({ setCenter, setRoute, markers, setMarkers, editable = true }) {
  const map = useMap();

  const RoutingMachineRef = useRef(null);
  const route = RoutingMachineRef.current;

  useMapEvents({
    click: (e) => {
      if (!editable) return;
      // Wrap the latlng to keep in bounds.
      setMarkers([...markers, e.latlng.wrap()]);
    },
    movestart: () => {
      setCenter(map.getCenter());
    },
  });

  const latLngMarkers = useMemo(() => {
    return markers.map((m) => L.latLng(m.lat, m.lng));
  }, [markers]);

  useEffect(() => {
    if (!route) return;
    route.setWaypoints(latLngMarkers);
  }, [route]);

  useEffect(() => {
    // If we have a route, update it.
    if (RoutingMachineRef.current) {
      RoutingMachineRef.current.getPlan().setWaypoints(latLngMarkers);
    } else {
      // Otherwise, create a new one.
      RoutingMachineRef.current = L.Routing.control({
        showAlternatives: false,
        addWaypoints: true,
        waypoints: latLngMarkers,
        routeWhileDragging: true,
        useZoomParameter: false,
        fitSelectedRoutes: false,
        lineOptions: {
          styles: [{ color: "DarkGreen", opacity: 1, weight: 3 }],
        },
      }).addTo(map);
      RoutingMachineRef.current.hide();
      RoutingMachineRef.current.route();
    }
    setRoute(RoutingMachineRef.current);
  }, [map, markers]);

  return <div></div>;
}

export default function MapLayout({
  centerPoint,
  eventRoute,
  setEventRoute,
  editable,
  saveable,
  showInfo = true,
  eventRouteIsSaving = true,
}) {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(centerPoint);
  const [mapStyle, setMapStyle] = useState("standard");
  const [route, setRoute] = useState(eventRoute || null);
  const [markers, setMarkers] = useState(eventRoute || []);

  useEffect(() => {
    // TODO: stop this from firing for users who arent owners.
    // If its editable, save button controls this.
    if (setEventRoute && !editable) {
      setEventRoute(markers);
    }
  }, [markers]);

  // Stops the map from graying out, not sure why this happens.
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 1000);

  return (
    <Stack>
      <Grid justify={showInfo ? "left" : "center"}>
        <Grid.Col xs={12} md={showInfo ? 9 : 12}>
          <MapContainer
            scrollWheelZoom={false}
            center={center}
            zoom={5}
            maxZoom={10}
            style={{
              height: "650px",
              zIndex: "0",
            }}
            whenReady={(e) => setMap(e.target)}
          >
            {/* Key is little hack to force a rerender. */}
            <TileLayer
              key={Object.keys(openStreetMapLayers).indexOf(mapStyle)}
              url={openStreetMapLayers[mapStyle]}
            />
            <Route
              route={route}
              editable={editable}
              setRoute={setRoute}
              setCenter={setCenter}
              markers={markers}
              setMarkers={setMarkers}
            />
          </MapContainer>
        </Grid.Col>
        {showInfo && (
          <Grid.Col xs={12} md={3}>
            <MapInfo
              setEventRoute={setEventRoute}
              eventRouteIsSaving={eventRouteIsSaving}
              changes={!_.isEqual(markers, eventRoute)}
              editable={editable}
              saveable={saveable}
              map={map}
              mapStyle={mapStyle}
              markers={markers}
              setMarkers={setMarkers}
              setMapStyle={setMapStyle}
            />
          </Grid.Col>
        )}
      </Grid>
    </Stack>
  );
}

function MapInfo({
  map,
  markers,
  setEventRoute,
  eventRouteIsSaving,
  setMarkers,
  mapStyle,
  setMapStyle,
  editable,
  saveable,
  changes,
}) {
  if (!map) return <Loader />;

  const center = map.getCenter();

  const renderMarkers = () => {
    return (
      <Stack>
        {!markers.length ? (
          <Group pb="sm">
            <ThemeIcon color="gray" variant="outline" size="sm">
              <IconMapPinOff />
            </ThemeIcon>
            <Text align="center" color="dimmed" size="sm">
              No markers set.
            </Text>
          </Group>
        ) : (
          markers.map((marker, idx) => (
            <Group pb="sm" key={idx}>
              <ThemeIcon size="sm">
                <IconMapPin />
              </ThemeIcon>
              <Text size="sm" align="middle">
                {roundLatLng(marker.lat)}, {roundLatLng(marker.lng)}
              </Text>
              {editable && (
                <IconX
                  size={16}
                  style={{ cursor: "pointer", opacity: "0.3" }}
                  onClick={() =>
                    setMarkers(markers.filter((m) => m !== marker))
                  }
                />
              )}
            </Group>
          ))
        )}
      </Stack>
    );
  };

  return (
    <Stack>
      <Select
        label="Map style"
        zIndex={999}
        value={mapStyle}
        onChange={setMapStyle}
        placeholder="Pick one"
        data={[
          { value: "standard", label: "Standard" },
          { value: "cycleosm", label: "CyclOSM" },
          { value: "opnvkarte", label: "ÖPNVKarte" },
        ]}
      />
      <Divider m="sm" />
      <Flex
        justify="space-evenly"
        direction={{ base: "column", xs: "row", md: "column" }}
        wrap="wrap"
      >
        <Stack align="center">{renderMarkers()}</Stack>
        <Divider m="sm" />
        <Flex
          justify="center"
          align="center"
          direction={{ base: "row", xs: "column", sm: "row" }}
          gap={{ base: "lg", md: "lg" }}
        >
          <Flex justify="center" align="center" direction="column">
            <Text color="dimmed" size="sm">
              Longitude:
            </Text>
            <Text>{`${roundLatLng(center.lng)}`}</Text>
          </Flex>
          <Flex justify="center" align="center" direction="column">
            <Text color="dimmed" size="sm">
              Lattitude:
            </Text>
            <Text>{`${roundLatLng(center.lat)}`}</Text>
          </Flex>
        </Flex>
        {editable && saveable && <Divider m="sm" />}
        {editable && saveable && (
          <Button
            disabled={!changes || !markers.length}
            loading={eventRouteIsSaving}
            onClick={() => setEventRoute(markers)}
          >
            Save
          </Button>
        )}
      </Flex>
    </Stack>
  );
}
