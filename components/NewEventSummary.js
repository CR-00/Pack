import { Box, Container, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import React from "react";
import _ from "lodash";
import findCenter from "../lib/findCentre";
import EventCard from "./EventCard";
import formatDateString from "../lib/formatDateString";

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
            {entry[0]}:
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
  let centerOfRoute = findCenter(route);

  return (
    <Container size="md">
      <Grid grow>
        <Grid.Col span={6}>
          <Paper shadow="md" p="xl">
            <Box p="md" sx={{ maxWidth: "400px", margin: "auto" }}>
              <EventCard
                blur={false}
                height={400}
                centerPoint={centerOfRoute}
                name={description.name}
                start={formatDateString(description.start)}
                difficulty={description.difficulty}
              />
            </Box>
            <Stack position="center" justify="center" p="md" mt="xl">
              <Text>Description</Text>
              <TextFields formSection={description} />
              <Text>Kit</Text>
              <TextFields formSection={kit} />
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
