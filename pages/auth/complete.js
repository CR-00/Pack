import { Text, Center, Paper } from "@mantine/core";
import { getSession } from "next-auth/react";
import ProfileEdit from "../../components/ProfileEdit";

export default function CompleteProfile() {
  return (
    <Center sx={{ padding: "48px" }}>
      <Paper radius="md" p="xl" withBorder sx={{ minWidth: "350px" }}>
      <Text align="center">Complete your profile</Text>
      <ProfileEdit />
      </Paper>
    </Center>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
}
