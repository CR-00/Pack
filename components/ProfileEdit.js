import {
  Center,
  Stack,
  TextInput,
  Button,
  Tooltip,
  Avatar,
  Space,
  Loader,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import BadWordsFilter from "bad-words";

const filter = new BadWordsFilter();

export default function ProfileEdit({ userData }) {
  /*
   If someone is setting up their profile for the first time
   they should be redirected to the index page if the save is successful.
  */
  const router = useRouter();
  const shouldRedirectAfterSaving = router.pathname !== "/profile";

  const { isError, isLoading, data } = useQuery(
    ["me"],
    () => api.get("/user"),
    userData
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(async () => {
    return await api
      .put("/user", form.values)
      .then(() => queryClient.invalidateQueries(["me"]));
  });

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
    },
    validate: {
      name: (val) => {
        if (filter.isProfane(val)) {
          return "Name contains bad words";
        }
        if (val.length >= 100) {
          return "Name cannot be longer than 100 characters";
        }
        if (val.length < 2) {
          return "Name must be at least 2 characters long";
        }
        if (!/^[a-z ,.'-]+$/i.test(val)) {
          return "Invalid name";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    /* Set the form values after obtaining session information. */
    if (data?.data?.user) {
      form.setValues({
        email: data.data.user.email,
        name: data.data.user.name ? data.data.user.name : "",
      });
    }
  }, [data]);

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.validate().hasErrors) {
      mutation.mutate();
      if (shouldRedirectAfterSaving) {
        window.location = process.env.NEXT_PUBLIC_CLIENT_URL;
      }
    }
  };

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <form onSubmit={submitForm}>
      <Space h="md" />
      <Stack>
        <Center>
          <Tooltip label="Profile pictures are only customisable by using a third-party authentication method.">
            <Avatar size="lg" src={data?.data?.user.image} />
          </Tooltip>
        </Center>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Your name"
          {...form.getInputProps("name")}
        />
        <TextInput
          disabled
          label="Email"
          placeholder="your-name@example.com"
          {...form.getInputProps("email")}
        />
        <Text size="xs" color="dimmed">
          This is not visible to other users.
        </Text>
        <Button loading={mutation.isLoading} type="submit">
          Save Changes
        </Button>
      </Stack>
    </form>
  );
}
