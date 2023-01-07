import { Tabs, Text, ThemeIcon } from "@mantine/core";
import {
  IconListDetails,
  IconMapPin,
  IconNotebook,
  IconSettings,
  IconUsers,
} from "@tabler/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function EventTabs({ event }) {
  const router = useRouter();

  const { id } = router.query;
  const { asPath } = router;

  const tabs = [
    { label: "overview", Icon: IconNotebook, link: `/events/${id}` },
    { label: "route", Icon: IconMapPin, link: `/events/${id}/route` },
    { label: "kit", Icon: IconListDetails, link: `/events/${id}/kit` },
    { label: "attendees", Icon: IconUsers, link: `/events/${id}/attendees` },
  ];

  const { data: session } = useSession();

  let userIsCreator = session?.user.id === event?.creatorId;

  const path = asPath.split("/");

  let tab = path.length === 3 ? "overview" : path[3];

  const handleTabSwitch = (v) => {
    let link = tabs.find((t) => t.label === v);
    router.push(link ? link.link : `/events/${id}/settings`);
  }

  return (
    <Tabs value={tab} onTabChange={(value) => handleTabSwitch(value)}>
      <Tabs.List aria-label="links">
        {tabs.map(({ label, Icon }) => (
          <Tabs.Tab
            key={label}
            value={label}
            aria-label={label}
            icon={
              <ThemeIcon>
                <Icon size={18} />
              </ThemeIcon>
            }
          >
            <Text transform="capitalize">{label}</Text>
          </Tabs.Tab>
        ))}
        {userIsCreator && (
            <Tabs.Tab
              key="settings"
              value="settings"
              aria-label={"settings"}
              icon={
                <ThemeIcon>
                  <IconSettings size={18} />
                </ThemeIcon>
              }
            >
              <Text>Settings</Text>
            </Tabs.Tab>
        )}
      </Tabs.List>
    </Tabs>
  );
}
