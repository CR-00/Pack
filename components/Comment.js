import { Box, Button, Group, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronUp, IconMinus, IconPlus } from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BadWordsFilter from "bad-words";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import api from "../lib/api";
import useProfileIsIncomplete from "../lib/profileIsIncomplete";

var filter = new BadWordsFilter();

export default function Comment({
  comment,
  level,
  userIsCreator,
  setCommentToDelete,
}) {
  const [expanded, setExpanded] = useState(level < 3);
  const [replyOpen, setReplyOpen] = useState(false);

  const form = useForm({
    initialValues: {
      comment: "",
      parentId: comment.id,
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

  const queryClient = useQueryClient();
  const addCommentMutation = useMutation(() =>
    api.post(`/events/${comment.eventId}/comments`, form.values).then(() => {
      setReplyOpen(false);
      queryClient.invalidateQueries(["comments", comment.eventId]);
    })
  );

  const session = useSession();
  const userCanDelete =
    userIsCreator || session?.data?.user?.id === comment.author.id;

  const postedAt = useMemo(() => {
    let date = new Date(comment.createdAt);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }, [comment.createdAt]);

  return (
    <>
      <Box mt="md" sx={{ overflow: "hidden" }}>
        <Stack>
          <Group>
            {expanded ? (
              <IconMinus
                size={16}
                style={{ marginBottom: "1px", cursor: "pointer" }}
                onClick={() => setExpanded(false)}
              />
            ) : (
              <IconPlus
                size={16}
                style={{ marginBottom: "1px", cursor: "pointer" }}
                onClick={() => setExpanded(true)}
              />
            )}
            <Text size="sm" weight={500}>
              {comment.author.name}
            </Text>
            <Text size="sm" color="dimmed">
              {postedAt}
            </Text>
          </Group>
          {expanded && (
            <form>
              <Text color={comment.deleted ? "dimmed" : ""}>
                {comment.comment}
              </Text>
              <Group spacing="xs">
                {level < 3 && (
                  <Text
                    mt="xs"
                    color="dimmed"
                    td="underline"
                    size="xs"
                    onClick={() => setReplyOpen(!replyOpen)}
                    style={{ cursor: "pointer" }}
                  >
                    Reply
                  </Text>
                )}
                {replyOpen && <IconChevronUp size={14} />}
                {userCanDelete && (
                  <Text
                    mt="xs"
                    color="red.7"
                    td="underline"
                    size="xs"
                    onClick={() => setCommentToDelete(comment.id)}
                    style={{ cursor: "pointer" }}
                  >
                    Delete
                  </Text>
                )}
              </Group>
            </form>
          )}
        </Stack>
        {replyOpen && (
          <Box sx={{ maxWidth: "50%" }} p="md">
            <Textarea
              placeholder="Reply..."
              pt="md"
              {...form.getInputProps("comment")}
            />
            <Button
              loading={addCommentMutation.isLoading}
              mt="sm"
              onClick={() => {
                if (!form.validate().hasErrors) {
                  addCommentMutation.mutate();
                }
              }}
              sx={{ float: "right" }}
            >
              Reply
            </Button>
          </Box>
        )}
        {comment.Children?.map((c) => (
          <Box ml="xl" key={c.id}>
            <Comment
              comment={c}
              level={level + 1}
              setCommentToDelete={setCommentToDelete}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
