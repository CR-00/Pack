import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { Center, Paper, Text, Divider, Stack, TextInput } from "@mantine/core";

import DiscordButton from "../../components/buttons/DiscordButton";
import EmailButton from "../../components/buttons/EmailButton";
import { useForm } from "@mantine/form";

export default function SignIn({ csrfToken }) {
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    },
  });

  return (
    <Center sx={{ padding: "48px" }}>
      <Paper radius="md" p="xl" withBorder sx={{ minWidth: "350px" }}>
        <Text align="center" size="lg" weight={500}>
          Welcome to Pack!
        </Text>
        <Divider
          label="Sign in with one of our providers"
          labelPosition="center"
          my="lg"
        />
        <form
          onSubmit={(e) => {
              e.preventDefault();
              signIn("email", { email: form.values.email, callbackUrl: "/" });
            }}
        >
          <Stack grow="true" spacing="xs">
            <DiscordButton
              onClick={() => signIn("discord", { callbackUrl: "/" })}
              radius="xl"
            >
              Discord
            </DiscordButton>
            <Divider
              label="Or sign in with email"
              labelPosition="center"
              my="xs"
            />
            <TextInput
              required
              label="Email"
              placeholder="your-name@example.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
            />
            <EmailButton type="submit">Send Link</EmailButton>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}

