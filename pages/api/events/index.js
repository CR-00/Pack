import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import { descriptionSchema } from "./[id]/description";
import { kitItemSchema } from "./[id]/kit/items";
import { routeSchema } from "./[id]/route";
import Joi from "joi";


const bringingKitSchema = Joi.object({
  bringingTent: Joi.boolean().required(),
  tentSleeps: Joi.number().min(1).max(100).required(),
});

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

    const { error } = descriptionSchema.validate(eventDescription);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { error: routeError } = routeSchema.validate(eventRoute);
    if (routeError) {
      return res.status(400).send({ error: routeError.details[0].message });
    }

    const { error: kitError } = bringingKitSchema.validate(eventKit);
    if (kitError) {
      return res.status(400).send({ error: kitError.details[0].message });
    }

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
