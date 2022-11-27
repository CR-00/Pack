import { Loader, Space, Text, Title } from "@mantine/core";
import dynamic from "next/dynamic";
import React, { useState } from "react";

export default function RouteForm({ setEventRoute }) {
  const [center, setCenter] = useState({ lng: -2.0389, lat: 53.6522 });
  const Map = React.useMemo(
    () =>
      dynamic(() => import("../components/Map"), {
        loading: () => <Loader/>,
        ssr: false,
      }),
    []
  );
  return (
    <>
      <Title order={3}>Plan Your Route</Title>
      <Text>You don't have to finish this now, but other users will find it helpful if you give a location for the event.</Text>
      <Space h="xl" />
      <Map centerPoint={center} setEventRoute={setEventRoute} styles={{ maxHeight: "400px" }}/>
    </>
  );
}
