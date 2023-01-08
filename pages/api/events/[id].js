import getServerSession from "../../../lib/getServerSession";
import applyRateLimit from "../../../lib/applyRateLimit";
import prisma from "../../../lib/prisma";
import { descriptionSchema } from "./[id]/description";
import { routeSchema } from "./[id]/route";
import { kitItemSchema } from "./[id]/kit/items";
import Joi from "joi";
import BadWordsFilter from "bad-words";
import getPointElevation from "../../../lib/getPointElevation";

const filter = new BadWordsFilter();

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

  const { id } = req.query;

  const session = await getServerSession(req, res);
  if (!session) {
    return res.status(401).send({ error: "Not signed in." });
  }

  if (req.method === "PUT") {
    let { description, coordinates, kitItems } = req.body;

    description.activity = description.activity.toUpperCase();

    if ("id" in description) {
      delete description.id;
    }
    if ("eventId" in description) {
      delete description.eventId;
    }

    kitItems = kitItems.map((item) => ({ ...item, kitItem: item.name }));

    const { error } = descriptionSchema.validate(description);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { error: routeError } = routeSchema.validate(coordinates);
    if (routeError) {
      return res.status(400).send({ error: routeError.details[0].message });
    }

    const { error: kitError } = Joi.array()
      .items(kitItemSchema)
      .validate(kitItems);
    if (kitError) {
      return res.status(400).send({ error: kitError.details[0].message });
    }

    let event = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (session.user.id !== event.creatorId) {
      return res.status(401).send({ error: "Not authorized." });
    }

    if (!event) {
      return res.status(404).send({ error: "Event not found." });
    }

    if (
      filter.isProfane(description.description) ||
      filter.isProfane(description.name)
    ) {
      return res.status(400).send({ error: "Profanity is not allowed." });
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },
      data: {
        description: {
          update: {
            ...description,
          },
        },
      },
    });

    const pointsWithElevation = await getPointElevation(coordinates)
    pointsWithElevation.forEach((point, idx) => {
      coordinates[idx].elevation = point.elevation;
    });

    if (
      !pointsWithElevation.length ||
      pointsWithElevation.length !== coordinates.length
    ) {
      return res
        .status(400)
        .send({ error: "Unable to gather elevation data." });
    }

    try {
      prisma.$transaction(async (tx) => {
        kitItems.map((item) => {
          prisma.kitItem.update({
            where: {
              id: item.id,
            },
            data: {
              ...item,
            },
          });

          pointsWithElevation.map((coordinate) => {
            prisma.coordinate.update({
              where: {
                id: coordinate.id,
              },
              data: {
                ...coordinate,
              },
            });
          });
        });
      });
    } catch (e) {
      return res.status(500).send({ error: e });
    }

    event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        description: true,
        coordinates: true,
        kitItems: true,
      },
    });

    res.status(200).send(event);
  }

  if (req.method === "DELETE") {
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        description: true,
      },
    });

    if (session.user.id !== event.creatorId) {
      return res.status(401).send({ error: "Not authorized." });
    }

    await prisma.event.delete({
      where: {
        id,
      },
    });
    return res.status(200).send({});
  }
}
