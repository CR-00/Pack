import { getSession } from "next-auth/react";
import applyRateLimit from "../../../../../../lib/applyRateLimit";
import prisma from "../../../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }
  const { kitItemId } = req.query;

  if (req.method === "DELETE") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }

    const kitItem = await prisma.KitItem.findUnique({
      where: {
        id: kitItemId,
      },
    });

    if (kitItem.ownerId !== session.user.id) {
      return res.status(401).send({ error: "Not authorized." });
    }

    const kitItems = await prisma.KitItem.delete({
      where: {
        id: kitItemId,
      },
    });
    return res.status(200).send({});
  }
}
