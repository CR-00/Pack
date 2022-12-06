import { AppShell, Navbar } from "@mantine/core";
import PageHeader from "./PageHeader";
import Nav from "./Nav";
import { useMediaQuery } from "@mantine/hooks";

export default function Layout({ children }) {
  const sm = useMediaQuery("(max-width: 640px)");
  return (
    <AppShell
      padding="md"
      navbar={!sm && <Nav />}
      header={<PageHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
