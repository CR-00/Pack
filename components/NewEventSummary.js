import {
  Box,
  Container,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import React from "react";
import _ from "lodash";
import findCenter from "../lib/findCentre";
import formatDateString from "../lib/formatDateString";
import dynamic from "next/dynamic";
import convertCamelCase from "../lib/convertCamelCase";

function TextFields({ formSection }) {
  let ignoredFields = ["description", "tentSleeps", "name", "difficulty"];

  const formatValue = (e) => {
    let [k, v] = e;
    switch (k) {
      case "visibility": {
        return _.startCase(v.toLowerCase());
      }
      case "activity": {
        return _.startCase(v.toLowerCase());
      }
      case "start": {
        return formatDateString(v);
      }
      case "end": {
        return formatDateString(v);
      }
      case "bringingTent": {
        return v ? "Yes" : "No";
      }
      default:
        return v;
    }
  };

  return (
    <Stack
      align="left"
      spacing="sm"
      sx={(theme) => ({
        padding: theme.spacing.md,
      })}
    >
      {Object.entries(_.omit(formSection, ignoredFields)).map((entry) => (
        <Group grow spacing="xl" key={entry[0]}>
          <Text align="left" size="sm" color="dimmed" transform="capitalize">
            {convertCamelCase(entry[0])}:
          </Text>
          <Text size="md" align="center">
            {formatValue(entry)}
          </Text>
        </Group>
      ))}
    </Stack>
  );
}

export default function NewEventSummary({ description, kit, route }) {
  const Map = React.useMemo(
    () =>
      dynamic(() => import("../components/Map"), {
        loading: () => <Loader />,
        ssr: false,
      }),
    []
  );

  return (
    <Box ml="lg" mr="lg">
      <Map
        showInfo={false}
        editable={false}
        centerPoint={findCenter(route)}
        eventRoute={route}
        eventRouteIsSaving={false}
        setEventRoute={false}
        style={{ height: "300px" }}
      />
      <Grid p="md" mt="xl">
        <Grid.Col sm={6}>
          <Text pl="md">Description</Text>
          <TextFields formSection={description} />
        </Grid.Col>
        <Grid.Col sm={6}>
          <Text pl="md">Kit</Text>
          <TextFields formSection={kit} />
        </Grid.Col>
      </Grid>
    </Box>
  );
}
