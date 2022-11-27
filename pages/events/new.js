import {
  Button,
  Container,
  Group,
  Paper,
  Space,
  Stepper,
  ThemeIcon,
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

const steps = [
  { description: "Description", Icon: IconNotebook },
  { description: "Route", Icon: IconMapPin },
  { description: "Kit", Icon: IconListDetails },
  { description: "Complete", Icon: IconCheckbox },
];

export default function NewEvent() {
  const [active, setActive] = useState(1);

  const [eventDescription, setEventDescription] = useState({
    difficulty: 1,
    activity: "hiking",
    name: "",
    start: "",
    end: "",
    description: "",
  });

  const [eventRoute, setEventRoute] = useState([]);

  const [eventKit, setEventKit] = useState({
    bringingTent: false,
    tentSleeps: 1,
  });

  const mutation = useMutation(async (formData) => {
    return await api.post("/events", {
      eventDescription,
      eventRoute,
      eventKit,
    });
  });

  const currentSectionIsValid = () => {
    if (active === 1) {
      return (
        eventDescription.difficulty >= 1 &&
        eventDescription.difficulty <= 5 &&
        eventDescription.activity &&
        eventDescription.name &&
        eventDescription.start &&
        eventDescription.end &&
        eventDescription.description
      );
    } else if (active === 2) {
      return eventRoute.length;
    } else if (active === 3) {
      // All this stuff is optional.
      return true;
    }
    return false;
  };

  return (
    <Paper p="lg">
      <Stepper radius="sm" size="sm" active={active}>
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
        />
      )}
      {active === 2 && <RouteForm setEventRoute={setEventRoute} />}
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
            loading={mutation.isLoading}
            sx={{ marginLeft: "auto" }}
            onClick={() => mutation.mutate()}
          >
            Create
          </Button>
        )}
      </Group>
    </Paper>
  );
}
