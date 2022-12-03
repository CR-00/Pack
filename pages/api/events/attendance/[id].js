import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    const attendees = await prisma.eventAttendee.findMany({
      where: {
        eventId: {
          equals: parseInt(id),
        },
      },
      include: {
        user: true,
      },
    });
    return res.status(200).send(attendees);
  }
}
