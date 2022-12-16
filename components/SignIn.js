import Link from "next/link";
import { Button } from "@mantine/core";

export default function SignIn(props) {
  return (
    <Link href="/auth/signin" passHref legacyBehavior>
      <Button component="a" {...props}>
        Sign In
      </Button>
    </Link>
  );
}
