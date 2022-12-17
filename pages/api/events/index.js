import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async (req, res) => {
  
  if (req.method === "GET") {

    let { page, start, end, search } = req.query;

    page = parseInt(page);

    // No more results.
    if (isNaN(page)) {
      return res.status(200).send({ events: [] });
    }

    const filter = {};

    if (start !== "null" && end !== "null") {
      filter.start = {
        gte: new Date(start).toISOString(),
      };
      filter.end = {
        lte: new Date(end).toISOString(),
      };
    }

    if (search) {
      filter.name = {
        startsWith: req.query.search,
        mode: "insensitive",
      };
    }

    const limit = 20;

    const events = await prisma.event.findMany({
      take: limit,
      skip: page * limit,
      where: {
        description: { ...filter, visibility: { equals: "PUBLIC" } },
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
    });

    res.json({
      events,
      nextId: events.length === limit ? page + 1 : undefined,
    });
  }

  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session) {
      res.status(401).send({ error: "Not signed in." });
    }

    const { eventDescription, eventRoute, eventKit } = req.body;
    
    const result = await prisma.event.create({
      data: {
        creator: {
          connect: {
            email: session.user.email,
          },
        },
        description: {
          create: { ...eventDescription },
        },
        coordinates: {
          create: eventRoute,
        },
        kitItems: {
          create: [
            {
              name: "TENT",
              capacity: eventKit.tentSleeps,
              owner: {
                connect: {
                  email: session.user.email,
                },
              },
            },
          ],
        },
        attendees: {
          create: [
            {
              user: {
                connect: {
                  email: session.user.email,
                },
              },
              status: "ACCEPTED",
            },
          ],
        },
      },
      include: {
        description: true,
        kitItems: true,
        coordinates: true,
        creator: true,
        attendees: true,
      },
    });

    res.json(result);
  }
};
