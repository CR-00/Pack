import { Box, Button, Modal, Text, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import BadWordsFilter from "bad-words";
import api from "../lib/api";
import Comment from "./Comment";
import { useState } from "react";

var filter = new BadWordsFilter();

export default function CommentsSection({ comments, userIsCreator }) {
  const form = useForm({
    initialValues: {
      comment: "",
      parentId: null,
    },
    validate: {
      comment: (value) => {
        return filter.isProfane(value)
          ? "Comment contains bad words"
          : !value.length
          ? "Comment cannot be empty"
          : value.length >= 1000
          ? "Comment cannot be longer than 1000 characters"
          : null;
      },
    },
  });

  const router = useRouter();
  const { id } = router.query;

  const { data } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => api.get(`/events/${id}/comments`),
    initialData: comments,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation((comment) =>
    api.post(`/events/${id}/comments`, comment).then(() => {
      queryClient.invalidateQueries(["comments", id]);
      form.reset();
    })
  );

  const [commentToDelete, setCommentToDelete] = useState(false);
  const deleteCommentMutation = useMutation(() =>
    api.delete(`/events/${id}/comments/${commentToDelete}`).then(() => {
      queryClient.invalidateQueries(["comments", id]);
      setCommentToDelete(false);
    })
  );

  return (
    <>
      <Modal
        opened={commentToDelete}
        onClose={() => setCommentToDelete(null)}
        title={<Title order={2}>Delete comment</Title>}
      >
        <Text>Are you sure?</Text>
        <Button
          onClick={deleteCommentMutation.mutate}
          loading={deleteCommentMutation.isLoading}
          mt="lg"
          color="red"
          sx={{ width: "100%" }}
        >
          DELETE
        </Button>
      </Modal>
      <Box pl="sm" pr="sm" mt="xl" mb="sm" sx={{ overflow: "hidden" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.validate().hasErrors) {
              mutation.mutate(form.values);
            }
          }}
        >
          <Title order={2} pt="sm" pb="sm">
            Comments
          </Title>
          <Box pb="xl">
            {data?.data?.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                userIsCreator={userIsCreator}
                setCommentToDelete={setCommentToDelete}
                level={0}
              />
            ))}
          </Box>
          <Textarea
            mt="xl"
            placeholder="Write a comment..."
            {...form.getInputProps("comment")}
          />
          <Button
            loading={mutation.isLoading}
            disabled={!form.values.comment}
            mt="md"
            sx={{ float: "right" }}
            type="submit"
          >
            Post comment
          </Button>
        </form>
      </Box>
    </>
  );
}
