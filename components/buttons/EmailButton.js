import { Button } from "@mantine/core";
import Image from "next/image";
import { IconMailFast } from "@tabler/icons";

export default function EmailButton(props) {
  return (
    <Button
      variant="outline"
      color="black"
      rightIcon={<IconMailFast />}
      {...props}
    />
  );
}
