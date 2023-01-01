import {
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Loader,
  Pagination,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { DateRangePicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import EventCard from "../components/EventCard";
import findCenter from "../lib/findCentre";
import api from "../lib/api";
import { useDebouncedState, useScrollIntoView } from "@mantine/hooks";
import prisma from "../lib/prisma";
import PII from "../lib/PII";
import { exclude } from "../lib/prisma";
import paginationAriaLabel from "../lib/paginationAriaLabel";

export default function Home({ events, numberOfEvents }) {
  // Start with dates unpicked.
  const [dateRange, setDateRange] = useState([null, null]);
  const [search, setSearch] = useDebouncedState("", 200);

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [dateRange, search]);

  const fetchEvents = async (page) =>
    await api.get(
      `/events?page=${page}&search=${search}&start=${dateRange[0]}&end=${dateRange[1]}`
    );

  const { isLoading, data, isFetching } = useQuery({
    queryKey: ["events", page, dateRange, search],
    queryFn: () => fetchEvents(page),
    keepPreviousData: true,

    initialData: { data: { events } },
  });

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
      {!data?.data.events.length && !isLoading && (
        <Center mt="xl" mb="xl">
          <Text align="center">No events found.</Text>
        </Center>
      )}
      {isFetching && page !== 1 && (
        <Center p="xl">
          <Loader />
        </Center>
      )}
      <Grid gutter="xs">
        {(!isFetching || page === 1) &&
          data?.data.events.map((event) => (
            <Grid.Col key={event.id} span={12} xs={6} sm={4} lg={2} xl={2}>
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
                  blur={true}
                  height={250}
                  width={250}
                  hoverAnimation={true}
                  centerPoint={findCenter(event.coordinates)}
                  name={event.description.name}
                  start={event.description.start}
                  difficulty={event.description.difficulty}
                />
              </Link>
            </Grid.Col>
          ))}
      </Grid>
      <Pagination
        disabled={isLoading || isFetching}
        aria-label="my pagination component"
        getItemAriaLabel={(p) => paginationAriaLabel(p)}
        onChange={(p) => {
          setPage(p);
        }}
        position="center"
        radius="sm"
        mt="xl"
        withEdges
        total={
          data?.data
            ? Math.ceil(data.data.numberOfEvents / 20)
            : Math.ceil(numberOfEvents / 20)
        }
        page={page}
      />
    </Paper>
  );
}

export async function getStaticProps() {
  let events = await prisma.event.findMany({
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

  let numberOfEvents = [...events].length;
  events = events.slice(0, 20);

  // Update with attendee length.
  events.forEach((e) => {
    e.attendees = e.attendees.length;
    e.creator = exclude(e.creator, PII);
  });

  return {
    props: {
      events,
      numberOfEvents,
    },
    revalidate: 60,
  };
}
