import { getSession } from "next-auth/react";

import applyRateLimit from "../../../../../lib/applyRateLimit";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }
  const { id, commentId } = req.query;

  if (req.method === "DELETE") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }

    const event = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        Children: true,
      }
    });

    if (
      !(
        comment.authorId === session.user.id ||
        comment.authorId === event.ownerId
      )
    ) {
      return res.status(401).send({ error: "Not authorized." });
    }

    // If the comment has children, then just change the text to [deleted],
    // otherwise, delete the comment.
    if (comment.Children.length > 0) {
        let comment = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
              deleted: true,
              comment: "[deleted]"
            },
        });
        res.status(200).send(comment);
    } else {
        let comment = await prisma.comment.delete({
            where: {
                id: commentId,
            },
        });
        res.status(200).send(comment);
    }
  }
}
