import { AppShell, Navbar } from "@mantine/core";
import PageHeader from "./PageHeader";
import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <AppShell
      padding="md"
      navbar={<Nav />}
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
