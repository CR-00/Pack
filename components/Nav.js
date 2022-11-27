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

const useStyles = createStyles(() => ({
  footer: {
    marginTop: "auto",
  },
}));

const links = [
  { icon: <IconMap2 />, href: "/", label: "Events" }
];

const NavLink = ({ label, href, icon }) => {
  const router = useRouter();
  return (
    <Link href={href}>
      <Tooltip label={label} position="right">
        <Button variant={router.pathname === href ? "light" : "subtle"}>
          {icon}
        </Button>
      </Tooltip>
    </Link>
  );
};

export default function Nav() {
  const { classes } = useStyles();

  const { isError, isLoading, data } = useQuery(["me"], () => api.get("/user"));

  return (
    <Navbar width={{ base: 80 }} p="xs">
      <Navbar.Section>
        <Stack spacing="xs">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              label={link.label}
              href={link.href}
              icon={link.icon}
            />
          ))}
        </Stack>
      </Navbar.Section>
      {data?.data?.user && (
        <Navbar.Section className={classes.footer}>
          <Divider my="sm" />
          <Link href="/profile">
            <Group position="center">
              <Tooltip label="Profile" position="right">
                <Avatar src={data.data.user.image} />
              </Tooltip>
            </Group>
          </Link>
        </Navbar.Section>
      )}
    </Navbar>
  );
}
