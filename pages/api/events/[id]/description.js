import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {

  const { id } = req.query;

  if (req.method === "GET") {
    const desc = await prisma.eventDescription.findUnique({
      where: {
        eventId: id,
      }
    });

    return res.status(200).send(desc);
  }

  if (req.method === "PUT") {

    const session = await getSession({ req });

    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        description: true,
      },
    });

    if (user.id !== event.creatorId) {
      return res.status(401).send({ error: "Not authorized." });
    }

    const updatedEvent = await prisma.EventDescription.update({
      where: {
        id: event.description.id,
      },
      data: {
        visibility: req.body.visibility,
        description: req.body.description,
        name: req.body.name,
        difficulty: req.body.difficulty,
        activity: req.body.activity,
        start: req.body.start,
        end: req.body.end,
      },
    });

    return res.status(200).send(updatedEvent);
  }
}
