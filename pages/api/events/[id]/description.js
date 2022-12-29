import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import Joi from "joi";
import applyRateLimit from "../../../../lib/applyRateLimit";


export const descriptionSchema = Joi.object({
  visibility: Joi.string().valid("PUBLIC", "PRIVATE").required(),
  description: Joi.string().max(500).required(),
  name: Joi.string().max(200).required(),
  difficulty: Joi.number().min(1).max(5).required(),
  activity: Joi.string().valid("HIKING").required(),
  start: Joi.date().required(),
  end: Joi.date().required(),
});


export default async function handler(req, res) {

  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

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

    const start = new Date(req.body.start);
    const end = new Date(req.body.end);

    if (start > end) {
      return res.status(400).send({ error: "Start date must be before end date." });
    }

    if (start < new Date() - 1000 * 60 * 60 * 24) {
      return res.status(400).send({ error: "Start date must be in the future." });
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
