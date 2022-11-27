import { Avatar, Container, Group, Table, Text } from "@mantine/core";

export default function KitSummary({ kitItems, attendees }) {
  const rows = kitItems.map(({ id, name, capacity, ownerId }) => {
    const attendee = attendees.find((a) => a.userId === ownerId).user;
    return (
      <tr key={id}>
        <td><Text>{name}</Text></td>
        <td><Text>{capacity}</Text></td>
        <td>
          <Group>
            <Avatar src={attendee.image} />
            <Text>{attendee.name}</Text>
          </Group>
        </td>
      </tr>
    );
  });
  return (
    <Container p="xl">
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Container>
  );
}
