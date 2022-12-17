import {
  Box,
  Container,
  Grid,
  Group,
  Space,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  Flex,
  Rating,
} from "@mantine/core";
import { IconCalendarEvent, IconMoon, IconSun } from "@tabler/icons";
import formatDateString from "../lib/formatDateString";
import calcDaysBetween from "../lib/calcDaysBetween";

export default function EventDescription({ description }) {
  let duration = calcDaysBetween(description.start, description.end);
  return (
    <Flex p="xl" direction="column" gap="xl">
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
              <Text weight={700}>{formatDateString(description.start)}</Text>
            </>
            <>
              <ThemeIcon variant="outline" sx={{ border: 0 }}>
                <IconCalendarEvent />
              </ThemeIcon>
              <Text weight={700}>{formatDateString(description.end)}</Text>
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
          <Rating value={description.difficulty} color="brand" readOnly />
        </Flex>
      </Flex>
      <Flex
        direction="column"
        align={{ base: "center", xs: "flex-start" }}
        pt="lg"
      >
        <Title order={2}>About:</Title>
        <Text>{description.description}</Text>
      </Flex>
    </Flex>
  );
}
