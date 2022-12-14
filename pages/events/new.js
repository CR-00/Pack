import {
  Button,
  Container,
  Group,
  Paper,
  Space,
  Stepper,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { useState } from "react";
import EventDescriptionForm from "../../components/EventDescriptionForm";
import KitForm from "../../components/KitForm";
import RouteForm from "../../components/RouteForm";
import {
  IconNotebook,
  IconMapPin,
  IconListDetails,
  IconCheckbox,
} from "@tabler/icons";
import NewEventSummary from "../../components/NewEventSummary";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import { useMediaQuery } from "@mantine/hooks";
import Router from "next/router";
import { getSession } from "next-auth/react";
import BadWordsFilter from "bad-words";
import getServerSession from "../../lib/getServerSession";

const filter = new BadWordsFilter();

const steps = [
  { description: "Description", Icon: IconNotebook },
  { description: "Route", Icon: IconMapPin },
  { description: "Kit", Icon: IconListDetails },
  { description: "Complete", Icon: IconCheckbox },
];

export default function NewEvent() {
  const [active, setActive] = useState(1);

  const sm = useMediaQuery("(max-width: 600px)");

  const [eventDescription, setEventDescription] = useState({
    difficulty: 1,
    visibility: "PUBLIC",
    activity: "HIKING",
    name: "",
    start: new Date(),
    end: new Date(),
    description: "",
  });

  const [eventRoute, setEventRoute] = useState([]);

  const [eventKit, setEventKit] = useState({
    bringingTent: false,
    tentSleeps: 1,
  });

  const mutation = useMutation(async () => {
    return await api
      .post("/events", {
        eventDescription,
        eventRoute,
        eventKit,
      })
      .then((res) => Router.push(`/events/${res.data.id}`));
  });

  const descriptionIsProfane = filter.isProfane(eventDescription.description);
  const nameIsProfane = filter.isProfane(eventDescription.name);

  const currentSectionIsValid = () => {
    if (active === 1) {
      return (
        eventDescription.difficulty >= 1 &&
        eventDescription.difficulty <= 5 &&
        eventDescription.activity &&
        eventDescription.name &&
        eventDescription.start &&
        eventDescription.end &&
        eventDescription.description &&
        !nameIsProfane &&
        !descriptionIsProfane
      );
    } else if (active === 2) {
      console.log(eventRoute)
      return eventRoute.length;
    } else if (active === 3) {
      // All this stuff is optional.
      return true;
    }
    return false;
  };

  return (
    <Container size="lg" mt="xs" pl="md" pr="md">
      <Paper p="lg">
        <Title pl="lg" mt="xs" order={2}>New Event</Title>
        <Stepper
          pl="lg"
          pr="lg"
          mt="md"
          radius="sm"
          size="sm"
          active={active}
          sx={{ display: sm ? "none" : "" }}
        >
          {steps.map(({ description, Icon }, idx) => (
            <Stepper.Step
              key={idx}
              icon={
                <ThemeIcon>
                  <Icon />
                </ThemeIcon>
              }
              label={`Step ${idx + 1}`}
              description={description}
            />
          ))}
        </Stepper>
        <Space h="xl" />
        {active === 1 && (
          <EventDescriptionForm
            eventDescription={eventDescription}
            setEventDescription={setEventDescription}
            nameIsProfane={nameIsProfane}
            descriptionIsProfane={descriptionIsProfane}
          />
        )}
        {active === 2 && (
          <RouteForm eventRoute={eventRoute} setEventRoute={setEventRoute}/>
        )}
        {active === 3 && <KitForm kit={eventKit} setEventKit={setEventKit} />}
        {active === 4 && (
          <NewEventSummary
            description={eventDescription}
            kit={eventKit}
            route={eventRoute}
          />
        )}
        <Space h="xl" />
        <Group position="apart">
          {active > 1 && (
            <Button
              variant="subtle"
              leftIcon={<IconChevronLeft />}
              onClick={() => setActive(active - 1)}
            >
              Prev
            </Button>
          )}
          {active < 4 && (
            <Button
              disabled={!currentSectionIsValid()}
              variant="subtle"
              rightIcon={<IconChevronRight />}
              sx={{ marginLeft: "auto" }}
              onClick={() => setActive(active + 1)}
            >
              Next
            </Button>
          )}
          {active === 4 && (
            <Button
              size="md"
              loading={mutation.isLoading}
              sx={{ marginLeft: "auto" }}
              onClick={() => mutation.mutate()}
            >
              Create
            </Button>
          )}
        </Group>
      </Paper>
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res);
  if (session === null) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
