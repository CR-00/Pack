import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

const itemsWithCapacityField = ["TENT"];

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }

    console.log(req.body);
    let create = {
      event: {
        connect: {
          id: req.body.eventId,
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
        id: req.body.id ? req.body.id : 0
      },
      update: {
        capacity: req.body.capacity
      },
      create
    });

    return res.status(200).send({ insertKitItem });
  }
}
