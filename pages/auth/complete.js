import { Text, Center, Paper } from "@mantine/core";
import ProfileEdit from "../../components/ProfileEdit";
import getServerSession from "../../lib/getServerSession";

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
  const session = await getServerSession(ctx.req, ctx.res);
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
