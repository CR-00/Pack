import {
  Modal,
  Title,
  TextInput,
  Button,
  Stack,
  Rating,
  Text,
  Textarea,
} from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../lib/api";

export default function EditDescriptionModal({
  eventDescription,
  onClose,
  opened,
}) {
  const [descCopy, setDescCopy] = useState({ ...eventDescription });

  const queryClient = useQueryClient();
  const mutation = useMutation(async () => {
    return await api
      .put(`/events/${descCopy.eventId}/description`, descCopy)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["description", descCopy.eventId],
        });
        onClose();
      });
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title>{descCopy.name}</Title>}
    >
      <Stack p="xs">
        <Text size="sm">Difficulty:</Text>
        <Rating
          value={descCopy.difficulty}
          color="brand"
          onChange={(v) => setDescCopy({ ...descCopy, difficulty: v })}
        />
        <DateRangePicker
          value={[new Date(descCopy.start), new Date(descCopy.end)]}
          placeholder="Start date"
          label="Start"
          minDate={new Date()}
          onChange={(v) => {
            setDescCopy({
              ...descCopy,
              start: v[0],
              end: v[1],
            });
          }}
        />
        <TextInput
          label="Name"
          value={descCopy.name}
          onChange={(e) => setDescCopy({ ...descCopy, name: e.target.value })}
        />
        <Textarea
          label="About"
          value={descCopy.description}
          onChange={(e) =>
            setDescCopy({ ...descCopy, description: e.target.value })
          }
        />
        <Button onClick={mutation.mutate} loading={mutation.isLoading}>
          Save
        </Button>
      </Stack>
    </Modal>
  );
}
