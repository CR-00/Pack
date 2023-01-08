import { Box, Text } from "@mantine/core";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip
} from "recharts";

export default function ElevationChart({ markers }) {
  return (
    <Box>
      <Text>Elevation</Text>
      <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={markers}>
      <Tooltip  />
        <Area
          type="monotone"
          dataKey="elevation"
          stroke="#FFA94D"
          fill="#FFD8A8"
        />
      </AreaChart>
    </ResponsiveContainer>
    </Box>
  );
}
