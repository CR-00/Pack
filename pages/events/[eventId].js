import {
  Avatar,
  Box,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import prisma, { exclude } from "../../lib/prisma";
import {
  IconNotebook,
  IconMapPin,
  IconListDetails,
  IconUsers,
  IconCrown,
} from "@tabler/icons";
import EventDescription from "../../components/EventDescription";
import dynamic from "next/dynamic";
import findCenter from "../../lib/findCentre";
import KitSummary from "../../components/KitSummary";
import EventAttendees from "../../components/EventAttendees";

const tabs = [
  { label: "description", Icon: IconNotebook },
  { label: "route", Icon: IconMapPin },
  { label: "kit", Icon: IconListDetails },
  { label: "attendees", Icon: IconUsers },
];

export default function Event({ event, attendees }) {
  const { description, kitItems, creator, coordinates } = event;
  console.log(attendees);
  // Preload this tab.
  const Map = React.useMemo(
    () =>
      dynamic(() => import("../../components/Map"), {
        loading: () => <Loader />,
        ssr: false,
      }),
    []
  );

  return (
    <Container size="xl" p="xs">
      <Paper p="md">
        <Group p="md" position="apart" align="top">
          <Title>{description.name}</Title>
          <Box sx={(theme) => ({ paddingRight: theme.spacing.xl })}>
            <Avatar src={creator.image} />
            <Text size="xs" align="center" weight={700}>
              {creator.name}
            </Text>
          </Box>
        </Group>
        <Tabs defaultValue="description">
          <Tabs.List>
            {tabs.map(({ label, Icon }) => (
              <Tabs.Tab
                key={label}
                value={label}
                icon={
                  <ThemeIcon>
                    <Icon size={18} />
                  </ThemeIcon>
                }
              >
                <Text transform="capitalize">{label}</Text>
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value="description" pt="xl">
            <EventDescription description={description} />
          </Tabs.Panel>
          <Tabs.Panel value="route" pt="xl">
            <Map
              centerPoint={findCenter(coordinates)}
              eventRoute={coordinates}
            />
          </Tabs.Panel>
          <Tabs.Panel value="kit" pt="xl">
            <KitSummary kitItems={kitItems} attendees={attendees} />
          </Tabs.Panel>
          <Tabs.Panel value="attendees" pt="xl">
            <EventAttendees attendees={attendees} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  let { eventId } = context.params;
  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(eventId),
    },
    include: {
      description: true,
      kitItems: true,
      coordinates: true,
      creator: true,
      attendees: false,
    },
  });

  const attendees = await prisma.eventAttendee.findMany({
    where: {
      eventId: parseInt(eventId),
    },
    include: {
      user: true,
    },
  });

  const PII = ["email", "emailVerified"];

  const attendeesMinusPII = attendees.map((attendee) => ({
    ...attendee,
    user: exclude(attendee.user, PII),
  }));

  return {
    props: {
      event: {
        ...event,
        creator: exclude(event.creator, PII),
      },
      attendees: attendeesMinusPII,
    },
  };
}
