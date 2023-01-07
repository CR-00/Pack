import { Container, Paper } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CommentsSection from "../../../components/CommentsSection";
import EventHeader from "../../../components/EventHeader";
import EventMetaTags from "../../../components/EventMetaTags";
import EventTabs from "../../../components/EventTabs";
import KitSummary from "../../../components/KitSummary";
import PII from "../../../lib/PII";
import prisma, { exclude } from "../../../lib/prisma";

export default function EventKit({ event, comments, attendees }) {
  const { data: kitItemData } = useQuery({
    queryKey: ["kitItems", event.id],
    queryFn: () => api.get(`/events/${event.id}/kit/items`),
    initialData: { data: event.kitItems },
  });

  const { data: attendeeData } = useQuery({
    queryKey: ["attendance", event.id],
    queryFn: () => api.get(`/events/${event.id}/attendance`),
    initialData: { data: attendees },
  });

  const { data: session } = useSession();

  let userIsCreator = session?.user.id === event.creatorId;

  return (
    <>
      <EventMetaTags event={event} />
      <Container size="lg" p="xl">
        <Paper p="md">
          <EventHeader event={event} creator={event.creator} />
          <EventTabs event={event} />
          <KitSummary
            kitItems={kitItemData.data}
            attendees={attendeeData.data}
          />
          <CommentsSection comments={comments} userIsCreator={userIsCreator} />
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
        id: event.id,
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
      coordinates: false,
      creator: true,
      attendees: true,
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
