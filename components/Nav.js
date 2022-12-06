import {
  Avatar,
  Button,
  createStyles,
  Divider,
  Group,
  Navbar,
  Stack,
  Tooltip,
} from "@mantine/core";
import { IconMap2 } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import NavLinks from "./NavLinks";

const useStyles = createStyles(() => ({
  footer: {
    marginTop: "auto",
  },
}));


export default function Nav() {
  const { classes } = useStyles();

  const {  data } = useQuery(["me"], () => api.get("/user"));

  return (
    <Navbar width={{ base: 80 }} p="xs">
      <Navbar.Section>
       <NavLinks/>
      </Navbar.Section>
      {data?.data?.user && (
        <Navbar.Section className={classes.footer}>
          <Divider my="sm" />
          <Link href="/profile">
            <Group position="center">
              <Tooltip label="Profile" position="right">
                <Avatar src={data.data.user.image} alt="user-avatar"/>
              </Tooltip>
            </Group>
          </Link>
        </Navbar.Section>
      )}
    </Navbar>
  );
}
