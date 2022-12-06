import {
  Header,
  Group,
  Title,
  Box,
  Burger,
  Transition,
  Paper,
  createStyles,
  Drawer,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
import Link from "next/link";
import SignOut from "./SignOut";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import NavLinks from "./NavLinks";

export default function PageHeader() {

  const { data: session } = useSession();

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
      <Drawer
        padding="xs"
        size="sm"
        opened={burgerOpen}
        onClose={() => setBurgerOpen(false)}
      >
        <NavLinks showLabels={true} closeSidebar={() => setBurgerOpen(false)} />
      </Drawer>
    </>
  );
}
