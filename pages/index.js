import {
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Loader,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { DateRangePicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import EventCard from "../components/EventCard";
import findCenter from "../lib/findCentre";
import api from "../lib/api";
import { useInView } from "react-intersection-observer";
import { useDebouncedState } from "@mantine/hooks";
import prisma from "../lib/prisma";
import PII from "../lib/PII";
import { exclude } from "../lib/prisma";

export default function Home({ events }) {
  // Start with dates unpicked.
  const [dateRange, setDateRange] = useState([null, null]);
  const [search, setSearch] = useDebouncedState("", 200);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["events"],
      async ({ pageParam = 0 }) => {
        return await api.get(
          `/events?page=${pageParam}&search=${search}&start=${dateRange[0]}&end=${dateRange[1]}`
        );
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

  const filterSearchResults = (page) => {
    let res = page.data.events.filter((e) =>
      e.description.name.toLowerCase().startsWith(search)
    );

    if (dateRange[0] && dateRange[1]) {
      let start = Date.parse(dateRange[0]);
      let end = Date.parse(dateRange[1]);

      res = res
        .filter((e) => Date.parse(e.description.start) >= start)
        .filter((e) => Date.parse(e.description.end) <= end);
    }
    return res;
  };

  return (
    <Paper p="md">
      <Flex
        grow={1}
        justify="space-between"
        gap="xl"
        basis="100%"
        direction={{ base: "column", xs: "row" }}
      >
        <Title order={2}>Events</Title>
        <DateRangePicker
          placeholder="Pick date range"
          value={dateRange}
          onChange={setDateRange}
          sx={{ flexGrow: 1 }}
        />
        <TextInput
          placeholder="Search..."
          onChange={(e) => setSearch(e.currentTarget.value.toLowerCase())}
          rightSection={<IconSearch style={{ height: "18px" }} />}
          sx={{ flexGrow: 1 }}
        />
        <Link href="/events/new" style={{ alignSelf: "flex-end" }}>
          <Button>Create</Button>
        </Link>
      </Flex>
      <Divider my="sm" />
      <Grid gutter="xs">
        {data?.pages.map((page) => {
          return filterSearchResults(page).map((event) => (
            <Grid.Col key={event.id} xs={6} sm={4} lg={3} xl={2}>
              <Link
                href={`/events/${event.id}`}
                prefetch={false}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  flexGrow: 1,
                }}
              >
                <EventCard
                  height={300}
                  width={300}
                  hoverAnimation={true}
                  centerPoint={findCenter(event.coordinates)}
                  name={event.description.name}
                  start={event.description.start}
                  difficulty={event.description.difficulty}
                />
              </Link>
            </Grid.Col>
          ));
        })}
      </Grid>
      <Center p="xl" ref={ref}>
        {isFetchingNextPage && <Loader />}
        {!isFetchingNextPage && data?.pages.length && <Text>No more events!</Text>}
      </Center>
    </Paper>
  );
}

export async function getStaticProps() {
  
  const events = await prisma.event.findMany({
    take: 20,
    skip: 0,
    where: {
      description: { visibility: { equals: "PUBLIC" } },
    },
    orderBy: {
      id: "asc",
    },
    include: {
      description: true,
      kitItems: true,
      coordinates: true,
      creator: true,
      attendees: true,
    },
  });

  // Update with attendee length.
  events.forEach((e) => {
    e.attendees = e.attendees.length;
    e.creator = exclude(e.creator, PII);
  });


  return {
    props: {
      events: [{ events }],
      eventsParams: [null],
    },
    revalidate: 60,
  };
}