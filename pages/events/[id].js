import {
  Box,
  Container,
  Paper,
} from "@mantine/core";
import React from "react";
import prisma, { exclude } from "../../lib/prisma";
import EventDescription from "../../components/EventDescription";
import findCenter from "../../lib/findCentre";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useSession } from "next-auth/react";
import CommentsSection from "../../components/CommentsSection";
import PII from "../../lib/PII";
import EventTabs from "../../components/EventTabs";
import EventHeader from "../../components/EventHeader";
import EventMetaTags from "../../components/EventMetaTags";
import getPointElevation from "../../lib/getPointElevation";

export default function Event({ event, attendees, comments }) {
  const { description, creator, coordinates } = event;

  const { data: attendeeData } = useQuery({
    queryKey: ["attendance", event.id],
    queryFn: () => api.get(`/events/${event.id}/attendance`),
    initialData: { data: attendees },
  });

  const { data: eventDescription } = useQuery({
    queryKey: ["description", event.id],
    queryFn: () => api.get(`/events/${event.id}/description`),
    initialData: { data: description },
  });

  const { data: session } = useSession();

  let userIsCreator = session?.user.id === event.creatorId;

  const centerPoint = findCenter(coordinates);

  return (
    <>
      <EventMetaTags event={event} />
      <Container size="lg" p="xl">
        <Paper p="md">
          <Box
            mt="xl"
            sx={(theme) => ({
              marginLeft: theme.spacing.md * 2,
              marginRight: theme.spacing.md * 2,
            })}
          >
            <EventHeader event={event} creator={creator} />
            <EventTabs event={event} />
            <EventDescription
              attendees={attendeeData.data}
              event={event}
              eventDescription={eventDescription.data}
              centerPoint={centerPoint}
            />
            <CommentsSection comments={comments} userIsCreator={userIsCreator} />
          </Box>
        </Paper>
      </Container>
    </>
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
      kitItems: false,
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

  let elevation = await getPointElevation(event.coordinates);
  console.log(elevation);

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
