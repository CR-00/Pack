import {
  Button,
  Modal,
  Select,
  Stack,
  Title,
  NumberInput,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../lib/api";
import KIT_LIST from "../lib/kitList";

export default function AddKitModal({ opened, onClose }) {
  const router = useRouter();
  const { id } = router.query;

  const [kitItem, setKitItem] = useState("");
  const [capacity, setCapacity] = useState(1);

  const queryClient = useQueryClient();
  const mutation = useMutation(async () => {
    return await api
      .put(`/events/${id}/kit/items`, {
        kitItem,
        capacity
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["kitItems", id],
        });
        onClose();
      });
  });

  return (
    <Modal title={<Title>Add Kit</Title>} opened={opened} onClose={onClose}>
      <Stack>
        <Select
          value={kitItem}
          onChange={(v) => setKitItem(v)}
          label="Type"
          placeholder="Type"
          data={KIT_LIST}
        />
        {kitItem && KIT_LIST.find((i) => i.value === kitItem).hasCapacity && (
          <NumberInput
            defaultValue={1}
            min={1}
            onChange={setCapacity}
            placeholder="How many people can use this?"
            label="How many people can use this?"
            withAsterisk
          />
        )}
        <Button onClick={mutation.mutate}>SUBMIT</Button>
      </Stack>
    </Modal>
  );
}
