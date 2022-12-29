import BadWordsFilter from "bad-words";
import Joi from "joi";
import getServerSession from "../../../../lib/getServerSession";
import applyRateLimit from "../../../../lib/applyRateLimit";
import PII from "../../../../lib/PII";
import prisma, { exclude } from "../../../../lib/prisma";

const filter = new BadWordsFilter();

const commentsSchema = Joi.object({
  comment: Joi.string().required().min(1).max(1000),
  parentId: Joi.string().optional().allow(null),
});

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

  const { id } = req.query;

  if (req.method === "GET") {
    // Comments have maximum depth so you can stop including children after just a few.
    let comments = await prisma.comment.findMany({
      where: {
        eventId: id,
        parentId: null,
      },
      include: {
        author: true,
        Children: {
          include: {
            author: true,
            Children: {
              include: {
                author: true,
                Children: {
                  include: {
                    author: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Recursively remove all PII from authors.
    let excludePII = (comments) => {
      let c = [...comments];
      for (let comment of c) {
        comment.author = exclude(comment.author, PII);
        comment.createdAt = comment.createdAt.toISOString();
        if (comment.Children) {
          comment.Children = excludePII(comment.Children);
        }
      }
      return c;
    };

    return res.status(200).send(excludePII(comments));
  }

  if (req.method === "POST") {
    const session = await getServerSession(req, res);
    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }

    const { error } = commentsSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    if (filter.isProfane(req.body.comment)) {
      return res.status(400).send({ error: "Comment contains bad words" });
    }

    let comment = await prisma.comment.create({
      data: {
        comment: req.body.comment,
        parentId: req.body.parentId,
        authorId: session.user.id,
        eventId: id,
      },
      include: {
        Children: {
          include: {
            Children: true,
          },
        },
      },
    });

    return res.status(200).send(comment);
  }
}
