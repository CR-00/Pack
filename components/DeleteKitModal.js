import { Button, Modal, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import api from "../lib/api";

export default function DeleteKitModal({ opened, onClose, item }) {
  const router = useRouter();
  const { eventId } = router.query;

  const queryClient = useQueryClient();
  const mutation = useMutation(async () => {
    return await api.delete(`/events/kit/items/${item.id}`).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["kitItems", parseInt(eventId)],
      });
      onClose();
    });
  });

  return (
    <Modal title={<Title>Remove Item</Title>} opened={opened} onClose={onClose}>
      <Stack>
        <Text align="center">Really remove this item?</Text>
        <Button onClick={mutation.mutate} loading={mutation.isLoading}>
          Remove
        </Button>
      </Stack>
    </Modal>
  );
}
