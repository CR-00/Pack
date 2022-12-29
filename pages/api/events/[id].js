import getServerSession from "../../../lib/getServerSession";
import applyRateLimit from "../../../lib/applyRateLimit";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

  const { id } = req.query;

  if (req.method === "DELETE") {
    const session = await getServerSession(req, res);
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

    await prisma.event.delete({
      where: {
        id,
      },
    });
    return res.status(200).send({});
  }
}
