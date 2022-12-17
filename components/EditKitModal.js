import {
  Button,
  Modal,
  NumberInput,
  Select,
  Stack,
  Title,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../lib/api";
import KIT_LIST from "../lib/kitList";

export default function EditKitModal({ item, opened, onClose }) {
  const router = useRouter();
  const { id } = router.query;

  const [capacity, setCapacity] = useState(item.capacity);

  const queryClient = useQueryClient();
  const mutation = useMutation(async () => {
    return await api
      .put(`/events/${id}/kit/items`, {
        id: item.id,
        kitItem: item.name,
        capacity: capacity,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["kitItems", id],
        });
        onClose();
      });
  });

  return (
    <Modal opened={opened} onClose={onClose} title={<Title>Edit</Title>}>
      <Stack>
        <Select
          disabled
          value={item.name}
          onChange={(v) => setKitItem(v)}
          label="Type"
          placeholder="Type"
          data={KIT_LIST}
        />
        {item.capacity && (
          <NumberInput
            value={item.capacity}
            min={1}
            onChange={setCapacity}
            placeholder="How many people can use this?"
            label="How many people can use this?"
            withAsterisk
          />
        )}
        <Button loading={mutation.isLoading} onClick={mutation.mutate}>
          SAVE
        </Button>
      </Stack>
    </Modal>
  );
}
