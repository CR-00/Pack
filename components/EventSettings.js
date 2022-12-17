import { Button, Container, Flex, Select } from "@mantine/core";
import { useState } from "react";
import DeleteEventModal from "./DeleteEventModal";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";

export function EventSettings({ event }) {
  const [eventCopy, setEventCopy] = useState({ ...event });

  const [deleteEventOpen, setDeleteEventOpen] = useState(false);

  const mutation = useMutation(async (eventDescription) => {
    return await api.put(`/events/${event.id}/description`, {
      eventDescription,
    });
  });

  return (
    <>
      <DeleteEventModal
        event={event}
        opened={deleteEventOpen}
        onClose={() => setDeleteEventOpen(false)}
      />
      <Container size="xl">
        <Select
          sx={(theme) => ({
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.md,
          })}
          label="Visibility"
          placeholder="Select visibility"
          value={eventCopy.description.visibility}
          data={[
            { label: "Public", value: "PUBLIC" },
            { label: "Unlisted", value: "UNLISTED" },
          ]}
          onChange={(v) => {
            let e = {
              ...eventCopy,
              description: { ...eventCopy.description, visibility: v },
            };
            setEventCopy(e);
            mutation.mutate(e.description);
          }}
        />
        <Flex justify="flex-end">
          <Button onClick={() => setDeleteEventOpen(true)}>DELETE</Button>
        </Flex>
      </Container>
    </>
  );
}
