import {
  Group,
  Space,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  Flex,
  Rating,
  ActionIcon,
} from "@mantine/core";
import { IconCalendarEvent, IconEdit, IconMoon, IconSun } from "@tabler/icons";
import formatDateString from "../lib/formatDateString";
import calcDaysBetween from "../lib/calcDaysBetween";
import { useSession } from "next-auth/react";
import EditDescriptionModal from "./EditDescriptionModal";
import { useState } from "react";

export default function EventDescription({ event, eventDescription }) {
  const { data: session } = useSession();
  const [editOpened, setEditOpened] = useState(false);
  let duration = calcDaysBetween(eventDescription.start, eventDescription.end);
  return (
    <>
      {session?.user.id === event.creatorId && (
        <EditDescriptionModal
          eventDescription={eventDescription}
          opened={editOpened}
          onClose={() => setEditOpened(false)}
        />
      )}
      <Flex p="xl" direction="column" gap="xl">
        {session?.user.id === event.creatorId && (
          <ActionIcon
            color="dark"
            sx={{ marginLeft: "auto" }}
            onClick={() => setEditOpened(true)}
          >
            <IconEdit size={24} />
          </ActionIcon>
        )}
        <Flex
          direction={{ base: "column-reverse", xs: "row" }}
          justify="space-evenly"
          gap="xl"
        >
          <Flex direction="column">
            <Title order={2} align="center">
              When:
            </Title>
            <Space h="md" />
            <Flex
              gap="md"
              direction={{ base: "column", sm: "row" }}
              align="center"
            >
              <>
                <ThemeIcon variant="outline" sx={{ border: 0 }}>
                  <IconCalendarEvent />
                </ThemeIcon>
                <Text weight={700}>{formatDateString(eventDescription.start)}</Text>
              </>
              <>
                <ThemeIcon variant="outline" sx={{ border: 0 }}>
                  <IconCalendarEvent />
                </ThemeIcon>
                <Text weight={700}>{formatDateString(eventDescription.end)}</Text>
              </>
              <Tooltip label={`${duration} ${duration > 1 ? "nights" : "day"}`}>
                <Group spacing={0}>
                  {duration > 1 ? <IconMoon /> : <IconSun />}
                  <Text weight={700} sx={{ marginBottom: "2px" }}>
                    {duration}
                  </Text>
                </Group>
              </Tooltip>
            </Flex>
          </Flex>
          <Flex direction="column" align={{ base: "center", xs: "flex-start" }}>
            <Title order={2}>Difficulty:</Title>
            <Rating value={eventDescription.difficulty} color="brand" readOnly />
          </Flex>
        </Flex>
        <Flex
          direction="column"
          align={{ base: "center", xs: "flex-start" }}
          pt="lg"
        >
          <Title order={2}>About:</Title>
          <Text>{eventDescription.description}</Text>
        </Flex>
      </Flex>
    </>
  );
}
