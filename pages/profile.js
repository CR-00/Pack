import { Divider, Grid, Paper, Title } from "@mantine/core";
import ProfileEdit from "../components/ProfileEdit";

export default function Profile() {
  return (
    <Grid>
      <Grid.Col span={4}>
        <Paper p="xl">
          <Title order={2}>Profile</Title>
          <Divider my="sm" />
          <ProfileEdit />
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
