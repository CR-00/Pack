import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma";
import Joi from "joi";
import applyRateLimit from "../../../../../lib/applyRateLimit";

export const routeSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().optional(),
    eventId: Joi.string().optional(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  })
);

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

  const { id } = req.query;

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

    const { error } = routeSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    // Delete all old and add new in a transaction.
    const newRoute = await prisma.$transaction([
      prisma.coordinate.deleteMany({
        where: {
          eventId: id,
        },
      }),
      prisma.coordinate.createMany({
        data: req.body.map((c) => ({
          ...c,
          eventId: id,
        })),
      }),
    ]);

    return res.status(200).send(newRoute);
  }
}
