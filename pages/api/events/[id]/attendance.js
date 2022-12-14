import prisma from "../../../../lib/prisma";
import Joi from "joi";
import getServerSession from "../../../../lib/getServerSession";
import applyRateLimit from "../../../../lib/applyRateLimit";

const attendanceSchema = Joi.object({
  id: Joi.string().optional(),
  status: Joi.string().valid("DECLINED", "INTERESTED", "ACCEPTED").required(),
});


export default async function handler(req, res) {
  
  try {
    await applyRateLimit(req, res)
  } catch {
    return res.status(429).send('Too many requests')
  }

  const { id } = req.query;

  if (req.method === "GET") {
    const attendees = await prisma.eventAttendee.findMany({
      where: {
        eventId: {
          equals: id,
        },
      },
      include: {
        user: true,
      },
    });
    return res.status(200).send(attendees);
  }

  if (req.method === "PUT") {

    const session = await getServerSession(req, res);
    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }
    
    const { error } = attendanceSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });
    
    const upsertAttendance = await prisma.EventAttendee.upsert({
        where: {
            eventId_userId:{
                eventId: id,
                userId: user.id
            }
        },
        update: {
            status: req.body.status
        },
        create: {
            status: req.body.status,
            user: {
                connect: {
                    email: session.user.email
                }
            },
            event: {
                connect: {
                    id
                }
            }
        },
    });

    return res.status(200).send(upsertAttendance);
  }
}
