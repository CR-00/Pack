import {
  Header,
  Group,
  Title,
  Box,
  Burger,
  Drawer,
  Divider,
  Loader,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SignOut from "./SignOut";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import NavLinks from "./NavLinks";
import SignIn from "./SignIn";
import ProfileLink from "./ProfileLink";

export default function PageHeader() {
  const { data: session, status: authStatus } = useSession();

  const sm = useMediaQuery("(max-width: 640px)");
  const [burgerOpen, setBurgerOpen] = useState(false);

  return (
    <>
      <Header height={60} p="xs">
        <Group position="apart">
          <Group noWrap>
            {sm && (
              <Burger
                size="sm"
                opened={burgerOpen}
                onClick={() => setBurgerOpen(!burgerOpen)}
              />
            )}
            <Link href="/">
              <Image
                width={56}
                height={40}
                alt="pack-logo"
                src={process.env.NEXT_PUBLIC_BRAND_LOGO}
              />
            </Link>
            <Title>Pack</Title>
          </Group>
          <Group>
            {!session && !sm && <SignIn />}
            {session && !sm && <SignOut color="red.6"/>}
          </Group>
        </Group>
      </Header>
      <Drawer
        padding="xs"
        size="sm"
        opened={burgerOpen}
        onClose={() => setBurgerOpen(false)}
      >
        {authStatus === "loading" && <Loader />}
        {authStatus === "authenticated" && (
          <>
            <ProfileLink showName={true} onClick={() => setBurgerOpen(false)} />
            <Divider my="sm" />
          </>
        )}
        <NavLinks showLabels={true} onClick={() => setBurgerOpen(false)} />
        <Divider my="sm" sx={{ top: "300px" }} />
        {session && <SignOut sx={{ width: "100%" }} color="red.6"/>}
        {!session && <SignIn sx={{ width: "100%" }} />}
      </Drawer>
    </>
  );
}
