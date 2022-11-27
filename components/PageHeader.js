import { Header, Group, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
import Link from "next/link";
import SignOut from "./SignOut";

export default function PageHeader() {
  const { data: session, status } = useSession();

  return (
    <Header height={60} p="xs">
      <Group position="apart">
        <Group noWrap>
          <Link href="/">
            <img
              style={{
                width: "100%",
                height: "40px",
              }}
              src={
                "https://res.cloudinary.com/dkoyqu0ds/image/upload/v1667126070/pack/pack-logo_vhoutm.png"
              }
            />
          </Link>
          <Title>Pack</Title>
        </Group>
        <Group>
          {!session && (
            <Link href="/auth/signin" passHref legacyBehavior>
              <Button component="a">Sign In</Button>
            </Link>
          )}
          {session && <SignOut />}
        </Group>
      </Group>
    </Header>
  );
}
