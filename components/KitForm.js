import {
  Center,
  Checkbox,
  Group,
  NumberInput,
  Space,
  Text,
  Title,
} from "@mantine/core";

export default function KitForm({ kit, setEventKit }) {
  return (
    <>
      <Title order={3}>Kit</Title>
      <Text>
        Fill out what kit you&apos;ll be bringing so we can help allocate resources
        between other attendees.
      </Text>
      <Space h="xl" />
      <Center>
        <Group>
          <Checkbox
            label={`I'm bringing a tent. It sleeps ...`}
            value={kit.bringingTent}
            onChange={(e) =>
              setEventKit({ ...kit, bringingTent: e.target.checked })
            }
          />
          <NumberInput
            value={kit.tentSleeps}
            onChange={(v) => setEventKit({ ...kit, tentSleeps: v })}
            disabled={!kit.bringingTent}
            formatter={(v) => `${v} ${v == 1 ? "person" : "people"}`}
          />
        </Group>
      </Center>
    </>
  );
}
