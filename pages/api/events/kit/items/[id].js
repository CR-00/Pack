import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "DELETE") {
    const kitItems = await prisma.KitItem.delete({
      where: {
        id: parseInt(id)
      },
    });
    return res.status(200).send(kitItems);
  }
}