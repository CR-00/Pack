import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
    const { id } = req.query
    if (req.method === "GET") {
        const kitItems = await prisma.KitItem.findMany({
            where: {
              eventId: {
                equals: parseInt(id)
              }
            }
          });
        return res.status(200).send(kitItems);
    }
}