import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma";
import Joi from "joi";

export const kitItemSchema = Joi.object({
  name: Joi.string().valid("TENT", "STOVE").required(),
  capacity: Joi.number().min(1).max(100).optional(),
});

const itemsWithCapacityField = ["TENT"];

export default async function handler(req, res) {

  const { id } = req.query;

  if (req.method === "GET") {
    const kitItems = await prisma.KitItem.findMany({
        where: {
          eventId: {
            equals: id
          }
        }
      });
    return res.status(200).send(kitItems);
  }
  
  if (req.method === "PUT") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }

    const { error } = kitItemSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
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
        id: req.body.id ? req.body.id : "n/a",  // No need for ID if inserting.
      },
      update: {
        capacity: req.body.capacity,
      },
      create,
    });

    return res.status(200).send({ insertKitItem });
  }
}
