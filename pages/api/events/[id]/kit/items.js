import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma";

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
