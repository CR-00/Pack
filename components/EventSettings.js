import { Button, Container, Flex } from "@mantine/core";
import { useState } from "react";
import DeleteEventModal from "./DeleteEventModal";

export function EventSettings({ event }) {

  const [deleteEventOpen, setDeleteEventOpen] = useState(false);

  return (
    <>
      <DeleteEventModal
        event={event}
        opened={deleteEventOpen}
        onClose={() => setDeleteEventOpen(false)}
      />
      <Container size="xl">
        <Flex justify="flex-end">
          <Button onClick={() => setDeleteEventOpen(true)}>DELETE</Button>
        </Flex>
      </Container>
    </>
  );
}
