import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async (req, res) => {

  if (req.method === "PUT") {

    const session = await getSession({ req });
    if (!session) {
      res.status(401).send({ error: "Not signed in." });
    }
  
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    const upsertAttendance = await prisma.EventAttendee.upsert({
        where: {
            eventId_userId:{
                eventId: parseInt(req.body.eventId),
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
                    id: parseInt(req.body.eventId)
                }
            }
        },
    });

    res.status(200).send(upsertAttendance);
  }
};
