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
  Loader,
  Box,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconEdit,
  IconMoon,
  IconSun,
  IconUser,
} from "@tabler/icons";
import formatDateString from "../lib/formatDateString";
import calcDaysBetween from "../lib/calcDaysBetween";
import { useSession } from "next-auth/react";
import EditDescriptionModal from "./EditDescriptionModal";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

export default function EventDescription({
  event,
  eventDescription,
  centerPoint,
  attendees,
}) {
  const MapPreview = useMemo(
    () =>
      dynamic(() => import("./MapPreview"), {
        loading: () => <Loader />,
        ssr: false,
      }),
    []
  );

  const { data: session } = useSession();
  const [editOpened, setEditOpened] = useState(false);
  let duration = calcDaysBetween(eventDescription.start, eventDescription.end);
  return (
    <Box mt="lg">
      <Flex
        gap="xl"
        mb="xl"
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-evenly" }}
        align={{ base: "center", md: "space-evenly" }}
      >
        <Tooltip label={`${duration} ${duration > 1 ? "nights" : "day"}`}>
          <Flex gap="0">
            {duration > 1 ? <IconMoon /> : <IconSun />}
            <Text weight={700} sx={{ marginBottom: "2px" }}>
              {duration}
            </Text>
          </Flex>
        </Tooltip>
        <Box sx={{ textAlign: "center" }}>
          <ThemeIcon variant="outline" sx={{ border: 0 }}>
            <IconCalendarEvent />
          </ThemeIcon>
          <Text weight={700}>{formatDateString(eventDescription.start)}</Text>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <ThemeIcon variant="outline" sx={{ border: 0 }}>
            <IconCalendarEvent />
          </ThemeIcon>
          <Text weight={700}>{formatDateString(eventDescription.end)}</Text>
        </Box>
        <Box>
          <Rating value={eventDescription.difficulty} color="brand" readOnly />
          <Text weight={700} align="center" mt="sm">
            Difficulty
          </Text>
        </Box>
        <Tooltip label="Attendees">
          <Flex>
            <IconUser size={24} />
            <Text weight={700}>{attendees.length}</Text>
          </Flex>
        </Tooltip>
      </Flex>
      <Box
        mt="xl"
        mb="xl"
        sx={(theme) => ({
          marginLeft: 2 * theme.spacing.xl,
          marginRight: 2 * theme.spacing.xl,
        })}
      >
        <MapPreview
          zoomable={true}
          dragging={true}
          centerPoint={centerPoint}
          style={{
            height: "600px",
            width: "100%",
            zIndex: 0,
            paddingLeft: "10px",
          }}
        />
      </Box>
      <Box
        sx={(theme) => ({
          marginLeft: 2 * theme.spacing.xl,
          marginRight: 2 * theme.spacing.xl,
          overflowWrap: "break-word",
          wordWrap: "break-word",
        })}
      >
        <Title align="left" order={2}>
          About:
        </Title>
        <Text mt="xl" align="left">
          {eventDescription.description}
        </Text>
      </Box>
    </Box>
  );
}
