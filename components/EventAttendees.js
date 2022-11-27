import {
  Avatar,
  Badge,
  Box,
  Center,
  Chip,
  Container,
  Table,
  Text,
} from "@mantine/core";
import { IconCheck, IconCross, IconQuestionMark, IconX } from "@tabler/icons";

export default function EventAttendees({ attendees }) {
  const rows = attendees.map(({ user, status }) => (
    <tr key={user.id}>
      <td>
        <Avatar src={user.image} />
      </td>
      <td>
        <Text weight={700}>{user.name}</Text>
      </td>
      <td style={{ justifyContent: "center" }}>
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
      </td>
    </tr>
  ));
  return (
    <Container p="xl">
      <Table horizontalSpacing="xl" sx={{ margin: "auto" }}>
        <thead></thead>
        <tbody>{rows}</tbody>
      </Table>
    </Container>
  );
}
