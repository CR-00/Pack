import { useQuery } from "@tanstack/react-query";
import { Avatar, Group, Loader, Text, Tooltip } from "@mantine/core";
import Link from "next/link";
import api from "../lib/api";

export default function ProfileLink({ showName = false, onClick }) {
  const { data, isLoading } = useQuery(["me"], () => api.get("/user"));

  if (isLoading) return <Loader sx={{ margin: "auto" }} />;

  return (
    <Link
      href="/profile"
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={onClick}
    >
      <Group position="center">
        <Tooltip label="Profile" position="right">
          <Avatar src={data?.data?.user?.image} alt="user-avatar" />
        </Tooltip>
        {showName && <Text>{data?.data?.user?.name}</Text>}
      </Group>
    </Link>
  );
}
