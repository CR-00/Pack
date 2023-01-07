import { Container, Paper } from "@mantine/core";
import EventHeader from "../../../components/EventHeader";
import EventSettings from "../../../components/EventSettings";
import EventTabs from "../../../components/EventTabs";
import PII from "../../../lib/PII";
import prisma, { exclude } from "../../../lib/prisma";
import getServerSession from "../../../lib/getServerSession";

export default function EventSettingsPage({ event }) {
  return (
    <>
      <Container size="lg" p="xl">
        <Paper p="md">
          <EventHeader event={event} creator={event.creator} />
          <EventTabs event={event} />
          <EventSettings event={event} />
        </Paper>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx) {
  
  let { id } = ctx.params;

  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      description: true,
      kitItems: true,
      coordinates: true,
      creator: true,
      attendees: true,
    },
  });


  const session = await getServerSession(ctx.req, ctx.res);
  if (!session || session.user.id !== event.creatorId) {
    return {
      redirect: {
        destination: `/events/${id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      event: {
        ...event,
        creator: exclude(event.creator, PII),
      },
    },
  };
}
