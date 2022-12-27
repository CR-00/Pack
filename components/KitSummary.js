import {
  ActionIcon,
  Avatar,
  Button,
  Container,
  Group,
  Table,
  Text,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import AddKitModal from "./AddKitModal";
import { IconPencil, IconTrash } from "@tabler/icons";
import EditKitModal from "./EditKitModal";
import DeleteKitModal from "./DeleteKitModal";

export default function KitSummary({ kitItems, attendees }) {
  const { data: session } = useSession();
  const [addItemOpen, setAddItemOpen] = useState(false);

  const [targetItem, setTargetItem] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);

  const usersAttendeeEntry =
    session && attendees.find((a) => a.userId === session.user.id)?.user;

  const rows = kitItems.map((item) => {
    const attendee = attendees.find((a) => a.userId === item.ownerId)?.user;
    const userOwnsItem = item.ownerId === session?.user.id;
  
    return (
      <tr key={item.id}>
        <td>
          <Text transform="capitalize">{item.name.toLowerCase()}</Text>
        </td>
        <td>
          <Text>{item.capacity}</Text>
        </td>
        <td>
          <Group>
            <Avatar src={attendee.image} />
            <Text>{attendee.name}</Text>
          </Group>
        </td>
        <td>
          {userOwnsItem && (
            <Group spacing="xl">
              <ActionIcon
                variant="transparent"
                color="brand"
                onClick={() => {
                  setTargetItem(item);
                  setEditItemOpen(true);
                }}
              >
                <IconPencil size={18} />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="brand"
                onClick={() => {
                  setTargetItem(item);
                  setDeleteItemOpen(true);
                }}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Group>
          )}
        </td>
      </tr>
    );
  });

  const empty = (
    <tr>
      <td colSpan="4">
        <Text align="center" p="xl">No items found.</Text>
      </td>
    </tr>
  );

  return (
    <>
      <EditKitModal
        item={targetItem}
        opened={editItemOpen}
        onClose={() => setEditItemOpen(false)}
      />
      <DeleteKitModal
        item={targetItem}
        opened={deleteItemOpen}
        onClose={() => setDeleteItemOpen(false)}
      />
      <AddKitModal opened={addItemOpen} onClose={() => setAddItemOpen(false)} />
      <Container p="xl">
        {usersAttendeeEntry && (
          <Button
            sx={(theme) => ({ float: "right", marginBottom: theme.spacing.sm })}
            onClick={() => setAddItemOpen(true)}
          >
            Add Item
          </Button>
        )}
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Owner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{kitItems.length ? rows : empty}</tbody>
        </Table>
      </Container>
    </>
  );
}
