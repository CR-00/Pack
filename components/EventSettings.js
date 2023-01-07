import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Rating,
  Select,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import DeleteEventModal from "./DeleteEventModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { DateRangePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import BadWordsFilter from "bad-words";

const filter = new BadWordsFilter();

export default function EventSettings({ event }) {
  const [deleteEventOpen, setDeleteEventOpen] = useState(false);

  const form = useForm({
    initialValues: event.description,
    validate: {
      visibility: () => null,
      difficulty: () => null,
      start: () => null,
      end: () => null,
      name: (value) => {
        return !value.length
          ? "Name cannot be empty"
          : value.length >= 100
          ? "Name cannot be longer than 100 characters"
          : filter.isProfane(value)
          ? "Name contains bad words"
          : null;
      },
      description: (value) => {
        return !value.length
          ? "Description cannot be empty"
          : value.length >= 1000
          ? "Description cannot be longer than 1000 characters"
          : filter.isProfane(value)
          ? "Description contains bad words"
          : null;
      },
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(async () => {
    return await api
      .put(`/events/${event.id}`, { ...event, description: form.values })
      .then(() => {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[1] === event.id,
        });
      });
  });

  return (
    <Box pt="xl" pb="xl">
      <DeleteEventModal
        event={event}
        opened={deleteEventOpen}
        onClose={() => setDeleteEventOpen(false)}
      />
      <Box pl="xl" mt="md" sx={{ maxWidth: "80%", margin: "auto" }}>
        <Select
          sx={(theme) => ({
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.md,
          })}
          label="Visibility"
          placeholder="Select visibility"
          data={[
            { label: "Public", value: "PUBLIC" },
            { label: "Unlisted", value: "UNLISTED" },
          ]}
          {...form.getInputProps("visibility")}
        />
        <Stack mt="lg">
          <Text size="sm">Difficulty:</Text>
          <Rating color="brand" {...form.getInputProps("difficulty")} />
          <DateRangePicker
            placeholder="Start date"
            label="Start"
            minDate={new Date()}
            value={[
              new Date(event.description.start),
              new Date(event.description.end),
            ]}
            onChange={(v) => {
              form.setFieldValue("start", v[0]);
              form.setFieldValue("end", v[1]);
            }}
          />
          <TextInput label="Name" {...form.getInputProps("name")} />
          <Textarea label="About" {...form.getInputProps("description")} />
        </Stack>
        <Flex justify="flex-end" mt="xl" gap="sm">
          <Button
            loading={mutation.isLoading}
            size="sm"
            onClick={() => {
              if (!form.validate().hasErrors) {
                mutation.mutate();
              }
            }}
          >
            SAVE
          </Button>
          <Button
            color="red.7"
            size="sm"
            onClick={() => setDeleteEventOpen(true)}
          >
            DELETE
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
