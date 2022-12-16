import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconMap2 } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const links = [{ icon: <IconMap2 />, href: "/", label: "Events" }];

const NavLink = ({ label, href, icon, showLabels, onClick }) => {
  const router = useRouter();

  const link = (
    <Link
      href={href}
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={onClick}
    >
      <Group position="left">
        {showLabels ? (
          <ThemeIcon
            color="brand"
            variant="outline"
            sx={(theme) => ({
              border: 0,
              marginLeft: theme.spacing.xl,
            })}
          >
            {icon}
          </ThemeIcon>
        ) : (
          <Button variant={router.pathname === href ? "light" : "subtle"}>
            {icon}
          </Button>
        )}

        {showLabels && <Text weight={700}>{label}</Text>}
      </Group>
    </Link>
  );
  return !showLabels ? (
    <Tooltip label={label} position="right">
      {link}
    </Tooltip>
  ) : (
    <Box
      sx={(theme) => ({
        padding: theme.spacing.xs,
        "&:hover": {
          boxShadow: theme.shadows.md,
        },
      })}
    >
      {link}
    </Box>
  );
};

export default function NavLinks({ showLabels, onClick }) {
  return (
    <Stack spacing="xs">
      {links.map((link, idx) => (
        <NavLink
          onClick={onClick}
          key={idx}
          showLabels={showLabels}
          label={link.label}
          href={link.href}
          icon={link.icon}
        />
      ))}
    </Stack>
  );
}
