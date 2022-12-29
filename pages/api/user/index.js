import prisma from "../../../lib/prisma";
import Crypto from "crypto";
import applyRateLimit from "../../../lib/applyRateLimit";
import Joi from "joi";
import BadWordsFilter from "bad-words";
import getServerSession from "../../../lib/getServerSession";
import { options } from "../auth/[...nextauth]";

const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required()
});

export default async (req, res) => {
  const session = await getServerSession(req, res);
  if (!session) {
    return res.status(401).send({ msg: "Not signed in." });
  }

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    return res.status(200).send({ user });
  } else if (req.method === "PUT") {
    try {
      await applyRateLimit(req, res);
    } catch {
      return res.status(429).send("Too many requests");
    }

    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }

    const filter = new BadWordsFilter();
    if (filter.isProfane(req.body.name)) {
      return res.status(400).send({ msg: "Profanity is not allowed." });
    }

    // Hash to protect name.
    const hashedName = Crypto.createHash("sha256")
      .update(req.body.name)
      .digest("hex");

    const img = `https://source.boringavatars.com/sunset/38/${hashedName}?colors=9DC9AC,FFFEC7,F56218,FF9D2E,919167`;

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: req.body.name,
        email: session.user.email,
        image: img,
      },
    });

    return res.status(200).send(updatedUser);
  }
};
