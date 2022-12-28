import {
  Avatar,
  Box,
  Container,
  Group,
  Loader,
  Paper,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import React from "react";
import prisma, { exclude } from "../../lib/prisma";
import {
  IconNotebook,
  IconMapPin,
  IconListDetails,
  IconUsers,
  IconSettings,
} from "@tabler/icons";
import EventDescription from "../../components/EventDescription";
import dynamic from "next/dynamic";
import findCenter from "../../lib/findCentre";
import KitSummary from "../../components/KitSummary";
import EventAttendees from "../../components/EventAttendees";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useSession } from "next-auth/react";
import { EventSettings } from "../../components/EventSettings";
import CommentsSection from "../../components/CommentsSection";
import PII from "../../lib/PII";

const tabs = [
  { label: "description", Icon: IconNotebook },
  { label: "route", Icon: IconMapPin },
  { label: "kit", Icon: IconListDetails },
  { label: "attendees", Icon: IconUsers },
];

export default function Event({ event, attendees, comments }) {
  const { description, kitItems, creator, coordinates } = event;
  
  const { data: attendeeData } = useQuery({
    queryKey: ["attendance", event.id],
    queryFn: () => api.get(`/events/${event.id}/attendance`),
    initialData: { data: attendees },
  });

  const { data: kitItemData } = useQuery({
    queryKey: ["kitItems", event.id],
    queryFn: () => api.get(`/events/${event.id}/kit/items`),
    initialData: { data: kitItems },
  });

  const { data: eventDescription } = useQuery({
    queryKey: ["description", event.id],
    queryFn: () => api.get(`/events/${event.id}/description`),
    initialData: { data: description },
  });


  const { data: session } = useSession();

  // Preload this tab.
  const Map = React.useMemo(
    () =>
      dynamic(() => import("../../components/Map"), {
        loading: () => <Loader />,
        ssr: false,
      }),
    []
  );

  const updateRouteMutation = useMutation(async (markers) => {
    return await api.put(`/events/${event.id}/route`, markers)
  });
  
  let userIsCreator = session?.user.id === event.creatorId;
 
  return (
    <Container size="xl" p="xs">
      <Paper p="md">
        <Group p="md" position="apart" align="top">
          <Title>{eventDescription.data.name}</Title>
          <Box sx={(theme) => ({ paddingRight: theme.spacing.xl })}>
            <Avatar src={creator.image} alt="event-creator-avatar" />
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
            {userIsCreator && (
              <Tabs.Tab
                key="settings"
                value="settings"
                icon={
                  <ThemeIcon>
                    <IconSettings size={18} />
                  </ThemeIcon>
                }
              >
                <Text>Settings</Text>
              </Tabs.Tab>
            )}
          </Tabs.List>
          <Tabs.Panel value="description" pt="xl">
            <EventDescription event={event} eventDescription={eventDescription.data} />
          </Tabs.Panel>
          <Tabs.Panel value="route" pt="xl">
            <Map
              editable={userIsCreator}
              centerPoint={findCenter(coordinates)}
              eventRoute={coordinates}
              eventRouteIsSaving={updateRouteMutation.isLoading}
              setEventRoute={(markers) => updateRouteMutation.mutate(markers)}
            />
          </Tabs.Panel>
          <Tabs.Panel value="kit" pt="xl">
            <KitSummary
              kitItems={kitItemData.data}
              attendees={attendeeData.data}
            />
          </Tabs.Panel>
          <Tabs.Panel value="attendees" pt="xl">
            <EventAttendees attendees={attendeeData.data} />
          </Tabs.Panel>
          <Tabs.Panel value="settings" pt="xl">
            <EventSettings event={event} />
          </Tabs.Panel>
        </Tabs>
        <CommentsSection comments={comments} userIsCreator={userIsCreator}/>
      </Paper>
    </Container>
  );
}

export async function getStaticPaths() {
  let events = await prisma.event.findMany();
  return {
    paths: events.map((event) => ({
      params: { id: event.id },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  let { id } = context.params;

  const event = await prisma.event.findUnique({
    where: {
      id,
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
      eventId: id,
    },
    include: {
      user: true,
    },
  });

  const attendeesMinusPII = attendees.map((attendee) => ({
    ...attendee,
    user: exclude(attendee.user, PII),
  }));

  let comments = await prisma.comment.findMany({
    where: {
      eventId: id,
      parentId: null,
    },
    include: {
      author: true,
      Children: {
        include: {
          author: true,
          Children: {
            include: {
              author: true,
              Children: {
                include: {
                  author: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Recursively remove all PII from authors.
  let excludePII = (comments) => {
    let c = [...comments];
    for (let comment of c) {
      comment.author = exclude(comment.author, PII);
      comment.createdAt = comment.createdAt.toISOString();
      if (comment.Children) {
        comment.Children = excludePII(comment.Children);
      }
    }
    return c;
  };

  return {
    props: {
      comments: excludePII(comments),
      event: {
        ...event,
        creator: exclude(event.creator, PII),
      },
      attendees: attendeesMinusPII,
    },
  };
}
