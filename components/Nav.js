import { createStyles, Divider, Navbar } from "@mantine/core";
import { useSession } from "next-auth/react";
import NavLinks from "./NavLinks";
import ProfileLink from "./ProfileLink";

const useStyles = createStyles(() => ({
  footer: {
    marginTop: "auto",
  },
}));

export default function Nav() {
  const { classes } = useStyles();
  const session = useSession();
  return (
    <Navbar width={{ base: 80 }} p="xs">
      <Navbar.Section>
        <NavLinks />
      </Navbar.Section>
      {session.status === "authenticated" && (
        <Navbar.Section className={classes.footer}>
          <Divider my="sm" />
          <ProfileLink />
        </Navbar.Section>
      )}
    </Navbar>
  );
}
