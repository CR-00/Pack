import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";

export default function SignOut(props) {
  return (
    <Button onClick={() => signOut()} {...props}>
      Sign Out
    </Button>
  );
}
