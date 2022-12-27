import {
  Alert,
  Box,
  Button,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import api from "../lib/api";
import profileIsIncomplete from "../lib/profileIsIncomplete";

export default function EventSignupModal({ opened, onClose }) {
  const router = useRouter();
  const { id } = router.query;

  const session = useSession();

  const [status, setStatus] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation(async () => {
    return await api
      .put(`/events/${id}/attendance`, {
        status,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["attendance", id],
        });
        onClose();
      });
  });

  const profileNotComplete = profileIsIncomplete();

  if (!session.status === "authenticated") {
    router.push("/auth/login");
  }

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
        {profileNotComplete && (
          <Text color="red.7" size="sm">
            You must complete your profile before signing up for an event.
          </Text>
        )}
        <Button
          disabled={!status || profileNotComplete}
          loading={mutation.isLoading}
          onClick={mutation.mutate}
        >
          SUBMIT
        </Button>
      </Stack>
    </Modal>
  );
}
