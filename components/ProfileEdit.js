import {
  Center,
  Stack,
  TextInput,
  Button,
  FileInput,
  Avatar,
  Space,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export default function ProfileEdit() {
  /*
   If someone is setting up their profile for the first time
   they should be redirected to the index page if the save is successful.
  */
  const router = useRouter();
  const shouldRedirectAfterSaving = router.pathname !== "/profile";

  const { isError, isLoading, data } = useQuery(["me"], () => api.get("/user"));

  const queryClient = useQueryClient();

  const mutation = useMutation(async (formData) => {
    return await fetch("/api/user", {
      method: "post",
      body: formData,
    }).then(() => queryClient.invalidateQueries(["me"]));
  });

  const form = useForm({
    initialValues: {
      image: null,
      email: "",
      name: "",
    },
    validate: {
      image: (val) => (val?.length ? null : "You must upload an avatar"),
      name: (val) => (/^[a-z ,.'-]+$/i.test(val) ? null : "Invalid name"),
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

  const user = data.data.user;

  /*
   If user hasn't changed the form then use the URL in
   their profile. If they haven't provided anything such 
   as if they're still completing registration, just use null
   to get the placeholder image, else parse the file.
  */
  const avatarSrc = form.values.image
    ? URL.createObjectURL(form.values.image)
    : typeof user.image === "string"
    ? user.image
    : user.image === null
    ? null
    : URL.createObjectURL(user.image);

  /*
   Upload the file to the server along with other values,
   redirect on success, otherwise show error.
  */
  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form.values).forEach(([k, v]) => {
      formData.append(k, v);
    });
    mutation.mutate(formData);
    if (shouldRedirectAfterSaving) {
      window.location = "http://127.0.0.1:3000/";
    }
  };

  return (
    <form onSubmit={submitForm}>
      <Space h="md" />
      <Stack>
        <Center>
          <Avatar size="lg" src={avatarSrc} />
        </Center>
        <FileInput
          withAsterisk
          label="Avatar"
          placeholder="Upload file"
          {...form.getInputProps("image")}
        />
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
        <Button loading={mutation.isLoading} type="submit">
          Save Changes
        </Button>
      </Stack>
    </form>
  );
}
