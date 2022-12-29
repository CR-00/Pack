import getServerSession from "../../../../../lib/getServerSession";
import prisma from "../../../../../lib/prisma";
import Joi from "joi";
import applyRateLimit from "../../../../../lib/applyRateLimit";

export const kitItemSchema = Joi.object({
  id: Joi.string().optional(),
  kitItem: Joi.string().valid("TENT", "STOVE").required(),
  capacity: Joi.number().min(1).max(100).optional(),
});

const itemsWithCapacityField = ["TENT"];

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

  const { id } = req.query;

  if (req.method === "GET") {
    const kitItems = await prisma.KitItem.findMany({
      where: {
        eventId: {
          equals: id,
        },
      },
    });
    return res.status(200).send(kitItems);
  }

  if (req.method === "PUT") {
    const session = await getServerSession(req, res);
    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }

    const { error } = kitItemSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const attendingEvent = await prisma.EventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: session.user.id,
        },
      },
    });

    if (!attendingEvent) {
      return res
        .status(404)
        .send({ error: "You must be attending an event to add an item." });
    }

    let create = {
      event: {
        connect: {
          id,
        },
      },
      owner: {
        connect: {
          id: session.user.id,
        },
      },
      name: req.body.kitItem,
    };

    if (itemsWithCapacityField.includes(req.body.kitItem)) {
      create.capacity = req.body.capacity;
    }

    const insertKitItem = await prisma.KitItem.upsert({
      where: {
        id: req.body.id ? req.body.id : "n/a", // No need for ID if inserting.
      },
      update: {
        capacity: req.body.capacity,
      },
      create,
    });

    return res.status(200).send({ insertKitItem });
  }
}
