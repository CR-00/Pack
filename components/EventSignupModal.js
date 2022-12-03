import { Button, Modal, Select, Stack, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../lib/api";

export default function EventSignupModal({ opened, onClose }) {
  const router = useRouter();
  const { eventId } = router.query;

  const [status, setStatus] = useState(null);
  
  const queryClient = useQueryClient();

  const mutation = useMutation(async () => {
    return await api.put("/events/attendance", {
      status,
      eventId,
    }).then(() => {
        queryClient.invalidateQueries({
            queryKey: ["attendance", parseInt(eventId)]
        });
        onClose();
    });
  });

  return (
    <Modal opened={opened} onClose={onClose} title={<Title>Sign Up</Title>}>
      <Stack>
        <Select
          value={status}
          onChange={(v) => setStatus(v)}
          label="Attendance"
          placeholder="Status"
          data={[
            { value: "INTERESTED", label: "Interested" },
            { value: "ACCEPTED", label: "Accepted" },
          ]}
        />
        <Button
          disabled={!status}
          loading={mutation.isLoading}
          onClick={mutation.mutate}
        >
          SUBMIT
        </Button>
      </Stack>
    </Modal>
  );
}
