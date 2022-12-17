import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
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

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).send({ error: "Not signed in." });
    }
  
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });
    
    const upsertAttendance = await prisma.EventAttendee.upsert({
        where: {
            eventId_userId:{
                eventId: req.body.id,
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
                    id: req.body.id
                }
            }
        },
    });

    return res.status(200).send(upsertAttendance);
  }
}