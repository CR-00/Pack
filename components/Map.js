import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import {
  Divider,
  Flex,
  Grid,
  Group,
  List,
  Loader,
  Select,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconMapPin, IconMapPinOff, IconPinned } from "@tabler/icons";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import roundLatLng from "../lib/roundLatLng";
import openStreetMapLayers from "../lib/openStreetMapLayers";

function Route({ setCenter, setRoute, markers, setMarkers }) {
  const map = useMap();

  const RoutingMachineRef = useRef(null);
  const route = RoutingMachineRef.current;

  useMapEvents({
    click: (e) => {
      setMarkers([...markers, e.latlng]);
    },
    movestart: () => {
      setCenter(map.getCenter());
    },
  });

  useEffect(() => {
    if (route) {
      route.setWaypoints(markers);
    }
  }, [markers]);

  useEffect(() => {
    if (!map || markers.length) return;
    else {
      RoutingMachineRef.current = L.Routing.control({
        showAlternatives: false,
        addWaypoints: true,
        waypoints: markers,
        routeWhileDragging: true,
      }).addTo(map);
      RoutingMachineRef.current.hide();
      RoutingMachineRef.current.route();
      setRoute(RoutingMachineRef.current);
    }
  }, [map]);

  return <div></div>;
}

export default function MapLayout({ centerPoint, eventRoute, setEventRoute }) {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(centerPoint);
  const [mapStyle, setMapStyle] = useState("standard");
  const [route, setRoute] = useState(eventRoute || null);
  const [markers, setMarkers] = useState(eventRoute || []);

  useEffect(() => {
    if (setEventRoute) {
      setEventRoute(markers);
    }
  }, [markers]);

  return (
    <Stack>
      <Grid justify="left">
        <Grid.Col xs={12} md={9}>
          <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom={false}
            style={{ height: "70vh", width: "100%", zIndex: "0" }}
            whenReady={(e) => setMap(e.target)}
          >
            {/* Key is little hack to force a rerender. */}
            <TileLayer
              key={Object.keys(openStreetMapLayers).indexOf(mapStyle)}
              url={openStreetMapLayers[mapStyle]}
            />
            <Route
              route={route}
              setRoute={setRoute}
              setCenter={setCenter}
              markers={markers}
              setMarkers={setMarkers}
            />
          </MapContainer>
        </Grid.Col>
        <Grid.Col xs={12} md={3}>
          <MapInfo
            map={map}
            route={route}
            mapStyle={mapStyle}
            markers={markers}
            setMapStyle={setMapStyle}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

function MapInfo({ map, markers, mapStyle, setMapStyle }) {
  if (!map) return <Loader />;

  const center = map.getCenter();

  const renderMarkers = () => {
    return (
      <List
        size="xs"
        spacing="xs"
        type="ordered"
        icon={
          <ThemeIcon size="sm">
            <IconMapPin />
          </ThemeIcon>
        }
      >
        {!markers.length ? (
          <List.Item
            icon={
              <ThemeIcon color="gray" variant="outline" size="sm">
                <IconMapPinOff />
              </ThemeIcon>
            }
          >
            <Text align="center" color="dimmed" size="sm">
              No markers set.
            </Text>
          </List.Item>
        ) : (
          markers.map((marker, idx) => (
            <List.Item key={idx}>
              <Text size="sm" align="middle">
                {roundLatLng(marker.lat)}, {roundLatLng(marker.lng)}
              </Text>
            </List.Item>
          ))
        )}
      </List>
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
          { value: "humanitarian", label: "Humanitarian" },
        ]}
      />
      <Divider m="sm" />
      <Stack align="center">{renderMarkers()}</Stack>
      <Divider m="sm" />
      <Flex
        justify="center"
        align="center"
        direction={{ base: "row", md: "column" }}
        gap={{ base: "lg", md: "sm" }}
      >
        <Group>
          <Text color="dimmed" size="sm">
            Longitude:
          </Text>
          <Text>{`${roundLatLng(center.lng)}`}</Text>
        </Group>
        <Group>
          <Text color="dimmed" size="sm">
            Lattitude:
          </Text>
          <Text>{`${roundLatLng(center.lat)}`}</Text>
        </Group>
      </Flex>
    </Stack>
  );
}
