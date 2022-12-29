import { Alert, Box, Divider, Grid, Paper, Text, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import ProfileEdit from "../components/ProfileEdit";
import api from "../lib/api";
import getServerSession from "../lib/getServerSession";
import useProfileIsIncomplete from "../lib/profileIsIncomplete";

export default function Profile({ session }) {
  const { data } = useQuery(["me"], () => api.get("/user"), {
    data: { session },
  });

  const profileCompleted = useProfileIsIncomplete();

  return (
    <>
      {data && profileCompleted && (
        <Box pt="md" pb="md">
          <Alert
            color="orange"
            variant="light"
            title="Your profile is incomplete"
            icon={<IconAlertCircle size={22} />}
          >
            <Text>
              In order to use the app fully, you must complete your profile.
            </Text>
          </Alert>
        </Box>
      )}
      <Grid>
        <Grid.Col span={4}>
          <Paper p="xl" sx={{ minWidth: 350 }}>
            <Title order={2}>Profile</Title>
            <Divider my="sm" />
            <ProfileEdit userData={data} />
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res);
  if (session === null) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
