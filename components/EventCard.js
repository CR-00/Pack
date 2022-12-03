import { Card, Text, Group, Rating, Loader } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import dynamic from "next/dynamic";
import React from "react";

export default function EventCard({
  centerPoint,
  name,
  description,
  difficulty,
  shadow,
}) {
  const { hovered, ref } = useHover();

  const MapPreview = React.useMemo(
    () =>
      dynamic(() => import("../components/MapPreview"), {
        loading: () => <Loader />,
        ssr: false,
      }),
    []
  );

  return (
    <Card
      p="lg"
      radius="md"
      withBorder
      ref={ref}
      shadow={shadow && hovered && "xl"}
    >
      <Card.Section>
        <MapPreview centerPoint={centerPoint} />
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{name}</Text>
        <Rating defaultValue={difficulty} color="brand.4" readOnly />
      </Group>
      <Text size="sm" color="dimmed" sx={{ maxWidth: 250 }}>
        {description}
      </Text>
    </Card>
  );
}
