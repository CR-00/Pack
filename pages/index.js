import {
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { getSession } from "next-auth/react";
import { IconSearch } from "@tabler/icons";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import prisma from "../lib/prisma";
import EventCard from "../components/EventCard";
import findCenter from "../lib/findCentre";
import api from "../lib/api";
import { useInView } from "react-intersection-observer";

export default function Home({ events }) {
  const [eventIds, setEventIds] = useState([]);
  const {
    data,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["events"],
    async ({ pageParam = 1 }) => {
      return await api.get(`/events?page=${pageParam}`);
    },
    {
      getNextPageParam: (page) => {
        return page.data.nextId ? page.data.nextId : false;
      },
    },
    { initialData: events }
  );

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  // Start with dates unpicked.
  const [value, setValue] = useState([null, null]);

  return (
    <Paper p="md">
      <Grid grow justify="space-between">
        <Grid.Col span={3}>
          <Title order={2}>Events</Title>
        </Grid.Col>
        <Grid.Col span={3}>
          <DateRangePicker
            placeholder="Pick dates range"
            value={value}
            onChange={setValue}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            placeholder="Search..."
            sx={{ width: "100%" }}
            rightSection={<IconSearch style={{ height: "18px" }} />}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <Link href="/events/new">
            <Button>Create</Button>
          </Link>
        </Grid.Col>
      </Grid>
      <Divider my="sm" />
      <Flex
        gap="md"
        wrap="wrap"
        flex="1"
        justify="center"
        flexWrap="wrap"
        minWidth="100%"
        basis="100%"
        sx={(theme) => ({ paddingTop: theme.spacing.lg })}
      >
        {data?.pages.map((page) => {
          return page.data.events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              prefetch={false}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <EventCard
                centerPoint={findCenter(event.coordinates)}
                name={event.description.name}
                start={event.description.start}
                difficulty={event.description.difficulty}
              />
            </Link>
          ));
        })}
      </Flex>
      <Center p="xl" ref={ref}>
        {isFetchingNextPage && <Loader />}
        {!isFetchingNextPage && <Text>No more events!</Text>}
      </Center>
    </Paper>
  );
}

export async function getStaticProps(context) {
  const events = await prisma.event.findMany({
    take: 10,
    orderBy: {
      id: "asc",
    },
    include: {
      description: true,
      kitItems: true,
      coordinates: true,
    },
  });

  return {
    props: {
      events: [{ events }],
      eventsParams: [null],
    },
  };
}

/*
export async function getServerSideProps(context) {
  // Redirect anyone that signed up with email to
  // complete their profile before continuing.
  const session = await getSession(context);
  const userName = session?.user?.name;
  if (session && !userName) {
    return {
      redirect: {
        destination: "/auth/complete",
        permanent: false,
      },
    };
  }

  return {
    props: { },
  };
}
*/
