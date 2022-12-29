import { unstable_getServerSession } from "next-auth";
import { options } from "../pages/api/auth/[...nextauth]";

const getServerSession = async (req, res) => {
  return await unstable_getServerSession(req, res, options);
};

export default getServerSession;