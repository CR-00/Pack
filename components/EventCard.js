import { Text, Rating, Box, Title } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons";
import React from "react";
import formatDateString from "../lib/formatDateString";
import coordsToTilePng from "../lib/coordsToTilePng";
import Image from "next/image";

export default function EventCard({
  centerPoint,
  name,
  difficulty,
  start,
  height,
  blur,
  hoverAnimation = false,
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
          transform: hoverAnimation ? "scale(1.03)" : "none",
          boxShadow: hoverAnimation ? theme.shadows.xl : "none",
        },
        height: height,
        overflow: "hidden",
      })}
      className="image-container"
    >
      <Image
        fill
        src={coordsToTilePng(centerPoint.lat, centerPoint.lng, 12)}
        alt="OpenStreetMap Image"
        style={{
          zIndex: 0,
          filter: blur ? "blur(3px)" : "",
          "-webkit-filter": blur ? "blur(3px)" : "",
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
        <Rating
          defaultValue={difficulty}
          color="brand.4"
          readOnly
          emptySymbol={<></>}
        />
        <div style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
          <IconCalendarEvent size={20} />
          <Text>{formatDateString(start)}</Text>
        </div>
      </Box>
    </Box>
  );
}
