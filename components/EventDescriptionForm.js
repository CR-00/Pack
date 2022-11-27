import { Text, Select, Grid, TextInput, Rating } from "@mantine/core";
import { Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

export default function EventDescriptionForm({ eventDescription, setEventDescription }) {
  return (
    <Grid justify="center" p="xl">
      <Grid.Col span={12}>
        <Text size="sm">Difficulty</Text>
        <Rating 
          color="dark" 
          defaultValue={eventDescription.difficulty}
          onChange={(v) => setEventDescription({ ...eventDescription, difficulty: v })}
        />
      </Grid.Col>
      
      <Grid.Col span={12}>
        <Select
          label="Activity"
          placeholder="Pick one"
          value={eventDescription.activity}
          onChange={(v) => setEventDescription({ ...eventDescription, activity: v })}
          data={[{ value: "hiking", label: "Hiking" }]}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          value={eventDescription.name}
          onChange={(e) =>
            setEventDescription({ ...eventDescription, name: e.target.value })
          }
          withAsterisk
          label="Name"
          placeholder="Event name"
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <DatePicker
          dropdownType="modal"
          value={eventDescription.start}
          onChange={(v) => setEventDescription({ ...eventDescription, start: v })}
          placeholder="Pick date"
          label="Start date"
          withAsterisk
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <DatePicker
          dropdownType="modal"
          value={eventDescription.end}
          onChange={(v) => setEventDescription({ ...eventDescription, end: v })}
          placeholder="Pick date"
          label="End date"
          withAsterisk
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea
          value={eventDescription.description}
          onChange={(e) => setEventDescription({ ...eventDescription, description: e.currentTarget.value })}
          placeholder="Describe your event"
          label="Provide a brief description of your event"
          withAsterisk
        />
      </Grid.Col>
    </Grid>
  );
}
