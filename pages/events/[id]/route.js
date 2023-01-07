import { Box, Container, Loader, Paper } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import CommentsSection from "../../../components/CommentsSection";
import EventHeader from "../../../components/EventHeader";
import EventMetaTags from "../../../components/EventMetaTags";
import EventTabs from "../../../components/EventTabs";
import api from "../../../lib/api";
import findCenter from "../../../lib/findCentre";
import PII from "../../../lib/PII";
import prisma, { exclude } from "../../../lib/prisma";

export default function EventRoute({ event }) {
  const Map = useMemo(
    () =>
      dynamic(() => import("../../../components/Map"), {
        loading: () => <Loader />,
        ssr: false,
      }),
    []
  );

  const { data: session } = useSession();
  const userIsCreator = session?.user?.id === event.creator.id;

  const updateRouteMutation = useMutation(async (markers) => {
    return await api.put(`/events/${event.id}/route`, markers);
  });

  return (
    <>
    <EventMetaTags event={event}/>
    <Container size="lg" p="xl">
      <Paper p="md">
        <EventHeader event={event} creator={event.creator} />
        <EventTabs event={event} />
        <Box mt="xl">
        <Map
          showInfo={true}
          editable={userIsCreator}
          saveable={userIsCreator}
          centerPoint={findCenter(event.coordinates)}
          eventRoute={event.coordinates}
          eventRouteIsSaving={updateRouteMutation.isLoading}
          setEventRoute={(markers) => updateRouteMutation.mutate(markers)}
        />
        </Box>
        <CommentsSection/>
      </Paper>
    </Container>
    </>
  );
}

export async function getStaticPaths() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: events.map((event) => ({
      params: {
        id: event.id.toString(),
      },
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
