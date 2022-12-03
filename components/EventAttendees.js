import {
  Avatar,
  Badge,
  Button,
  Container,
  Group,
  Loader,
  Select,
  Table,
  Text,
} from "@mantine/core";
import { IconCheck, IconQuestionMark, IconX } from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../lib/api";
import EventSignupModal from "./EventSignupModal";

export default function EventAttendees({ attendees }) {
  const router = useRouter();
  const { eventId } = router.query;

  const [signUpOpen, setSignUpOpen] = useState(false);

  // If the user is already signed up hide button.
  const { data: session, status } = useSession();

  const usersEventAttendee = attendees.find(
    (a) => a.userId === session?.user.id
  );

  const mutation = useMutation(async (status) => {
    return await api.put("/events/attendance", {
      status,
      eventId,
    });
  });

  const rows = attendees.map(({ user, status }) => (
    <tr key={user.id}>
      <td>
        <Avatar src={user.image} alt="attendee-avatar"/>
      </td>
      <td>
        <Text weight={700}>{user.name}</Text>
      </td>
      <td style={{ justifyContent: "center" }}>
        {!session || user.id !== session.user.id ? (
          <Badge
            size="lg"
            variant="light"
            leftSection={
              status === "ACCEPTED" ? (
                <IconCheck size={10} />
              ) : status === "INTERESTED" ? (
                <IconQuestionMark size={10} />
              ) : (
                <IconX size={10} />
              )
            }
            color={
              status === "ACCEPTED"
                ? "green"
                : status === "INTERESTED"
                ? "orange"
                : "red"
            }
            sx={{ textTransform: "capitalize", fontWeight: 700 }}
          >
            {status.toLowerCase()}
          </Badge>
        ) : (
          <Group spacing="xl">
            <Select
              defaultValue={usersEventAttendee.status}
              data={[
                { value: "ACCEPTED", label: "Accepted" },
                { value: "INTERESTED", label: "Interested" },
                { value: "DECLINED", label: "Declined" },
              ]}
              onChange={(v) => mutation.mutate(v)}
            />
            {mutation.isLoading && <Loader />}
          </Group>
        )}
      </td>
    </tr>
  ));

  return (
    <Container p="xl">
      <EventSignupModal
        opened={signUpOpen}
        onClose={() => setSignUpOpen(false)}
      />
      {!usersEventAttendee && session && (
        <Button
          sx={(theme) => ({ float: "right", margin: theme.spacing.xl })}
          onClick={() => setSignUpOpen(true)}
        >
          Sign Up
        </Button>
      )}
      <Table horizontalSpacing="xl" sx={{ margin: "auto" }}>
        <thead></thead>
        <tbody>{rows}</tbody>
      </Table>
    </Container>
  );
}
