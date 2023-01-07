import { Avatar, Box, Group, Text, Title } from "@mantine/core";

export default function EventHeader({ event, creator }) {
  return (
    <Group p="md" position="apart" align="top">
      <Title>{event.description.name}</Title>
      <Box sx={(theme) => ({ paddingRight: theme.spacing.xl })}>
        <Avatar src={creator.image} alt="event-creator-avatar" />
        <Text size="xs" align="center" weight={700}>
          {creator.name}
        </Text>
      </Box>
    </Group>
  );
}
