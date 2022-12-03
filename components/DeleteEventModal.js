import { Button, Modal, Stack, Text, Title } from "@mantine/core";
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
    <Modal opened={opened} onClose={onClose} title={<Title>DELETE</Title>}>
      <Stack>
        <Text align="center">Really delete {event.description.name}?</Text>
        <Button
          loading={mutation.isLoading}
          onClick={mutation.mutate}
          color="red"
        >
          YES, DELETE
        </Button>
      </Stack>
    </Modal>
  );
}
