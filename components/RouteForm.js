import { Box, Center, Loader, Space, Text, Title } from "@mantine/core";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import findCenter from "../lib/findCentre";

export default function RouteForm({ eventRoute, setEventRoute }) {
  const [center] = useState(
    eventRoute.length ? findCenter(eventRoute) : { lng: -2.0389, lat: 53.6522 }
  );

  console.log(center)

  const Map = React.useMemo(
    () =>
      dynamic(() => import("../components/Map"), {
        loading: () => <Center><Loader /></Center>,
        ssr: false,
      }),
    []
  );
  return (
    <Box ml="lg" mr="lg">
      <Title order={3}>Plan Your Route</Title>
      <Text>
        You don&apos;t have to finish this now, but other users will find it helpful
        if you give a location for the event.
      </Text>
      <Space h="xl" />
      <Map
        editable={true}
        saveable={false}
        centerPoint={center}
        eventRoute={eventRoute}
        setEventRoute={setEventRoute}
        styles={{ maxHeight: "400px" }}
      />
    </Box>
  );
}
