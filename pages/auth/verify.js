import { Center, Container, Paper, Text, Title } from "@mantine/core";

export default function Verify() {
  return (
    <Container size="xl" px="xl">
      <Center sx={{ padding: 48 }}>
        <Paper>
          <Title align="center">Check your email.</Title>
          <Text align="center">
            A sign in link has been sent to your email address.
          </Text>
        </Paper>
      </Center>
    </Container>
  );
}
