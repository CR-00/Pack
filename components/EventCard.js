import { Card, Text, Group, Rating, Loader, Box, Title } from "@mantine/core";
import { IconCalendarEvent, IconUsers } from "@tabler/icons";
import dynamic from "next/dynamic";
import React from "react";
import formatDateString from "../lib/formatDateString";
import coordsToTilePng from "../lib/coordsToTilePng";

export default function EventCard({
  centerPoint,
  name,
  difficulty,
  start,
  shadow,
}) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[0],
        border: "1px solid",
        borderRadius: "5px",
        position: "relative",
        textDecoration: "none",
        overflow: "hidden",
        borderColor: theme.colors.dark[0],
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: theme.shadows.xl,
        },
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)",
      })}
    >
      <img
        src={coordsToTilePng(centerPoint.lat, centerPoint.lng, 12)}
        alt="OpenStreetMap Image"
        style={{
          width: "100%",
          zIndex: -1,
        }}
      />
      <Box
        style={{
          padding: "10px",
          position: "absolute",
          bottom: "10px",
          left: "10px",
        }}
      >
        <Title
          order={2}
          style={{ margin: 0, padding: 0, wordWrap: "break-word" }}
        >
          {name}
        </Title>
        <Rating defaultValue={difficulty} color="brand.4" readOnly />
        <div style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
          <IconCalendarEvent size={20} />
          <Text>{formatDateString(start)}</Text>
        </div>
      </Box>
    </Box>
  );
}
