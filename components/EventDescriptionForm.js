import { Text, Select, Grid, TextInput, Rating } from "@mantine/core";
import { Textarea } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";

export default function EventDescriptionForm({
  eventDescription,
  setEventDescription,
  nameIsProfane,
  descriptionIsProfane,
}) {
  return (
    <Grid justify="center" p="xl">
      <Grid.Col span={12}>
        <Text size="sm">Difficulty</Text>
        <Rating
          color="dark"
          defaultValue={eventDescription.difficulty}
          onChange={(v) =>
            setEventDescription({ ...eventDescription, difficulty: v })
          }
        />
      </Grid.Col>

      <Grid.Col span={12}>
        <Select
          label="Visibility"
          placeholder="Pick one"
          defaultValue={eventDescription.visibility}
          onChange={(v) =>
            setEventDescription({ ...eventDescription, visibility: v })
          }
          data={[
            { value: "PUBLIC", label: "Public" },
            { value: "UNLISTED", label: "Unlisted" },
          ]}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          value={eventDescription.name}
          error={nameIsProfane ? "Profanity is not allowed" : null}
          onChange={(e) =>
            setEventDescription({ ...eventDescription, name: e.target.value })
          }
          withAsterisk
          label="Name"
          placeholder="Event name"
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <DateRangePicker
          dropdownType="modal"
          minDate={new Date()}
          value={[new Date(eventDescription.start), new Date(eventDescription.end)]}
          onChange={(v) =>
            setEventDescription({ ...eventDescription, start: v[0], end: v[1] })
          }
          placeholder="Pick date"
          label="Start date"
          withAsterisk
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea
          value={eventDescription.description}
          error={descriptionIsProfane ? "Profanity is not allowed" : null}
          onChange={(e) =>
            setEventDescription({
              ...eventDescription,
              description: e.currentTarget.value,
            })
          }
          placeholder="Describe your event"
          label="Provide a brief description of your event"
          withAsterisk
        />
      </Grid.Col>
    </Grid>
  );
}
