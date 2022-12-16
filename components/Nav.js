import { createStyles, Divider, Navbar } from "@mantine/core";
import NavLinks from "./NavLinks";
import ProfileLink from "./ProfileLink";

const useStyles = createStyles(() => ({
  footer: {
    marginTop: "auto",
  },
}));

export default function Nav() {
  const { classes } = useStyles();

  return (
    <Navbar width={{ base: 80 }} p="xs">
      <Navbar.Section>
        <NavLinks />
      </Navbar.Section>
      <Navbar.Section className={classes.footer}>
        <Divider my="sm" />
        <ProfileLink />
      </Navbar.Section>
    </Navbar>
  );
}
