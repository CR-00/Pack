import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import api from "../lib/api";

export default function DeleteEventModal({ opened, onClose, event }) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const mutation = useMutation(async () => {
    return await api.delete(`/events/${event.id}`).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      onClose();
      router.push("/");
    });
  });
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title>Confirm delete</Title>}
    >
      <Stack>
        <Divider mt="xs" />
        <Text align="center" mt="xs">
          Really delete {event.description.name}?
        </Text>
        <Divider mt="xs" />
        <Button
          loading={mutation.isLoading}
          onClick={mutation.mutate}
          color="red.7"
        >
          YES, DELETE
        </Button>
      </Stack>
    </Modal>
  );
}
