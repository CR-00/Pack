import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

// Turn body parsing off since its FormData.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ error: "Not signed in." });
  }

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      }
    });
    res.status(200).send({ user });
  }
  else if (req.method === "POST") {

    const data = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    /* If they're uploading for the first time picture will be a file. */
    let result = {};
    if (data.files.image) {
      const targetPath = path.join(process.cwd(), `/uploads/`);
      try {
        await fs.access(targetPath);
      } catch (e) {
        await fs.mkdir(targetPath);
      }

      // Move uploaded files to directory
      const tempPath = data.files.image.filepath;
      const uploadPath = targetPath + data.files.image.originalFilename;
      await fs.rename(tempPath, uploadPath);

      result = await cloudinary.uploader.upload(uploadPath, {
        folder: process.env.CLOUDINARY_FOLDER,
      });

      // Delete the file now.
      fs.unlink(uploadPath);
    } else if (!data.fields.image) {
      res.status(422).send({ error: "Missing image." });
    } else {
      result.url = data.fields.image;
    }

    // Now update the users DB entry if the upload worked.
    if (result.url) {
      await prisma.user.update({
        where: {
          email: session.user.email,
        },
        data: {
          name: data.fields.name,
          email: data.fields.email,
          image: result.url,
        },
      });
    } else {
      res.status(500).send({ error: "Unable to upload file." });
    }

    res.status(200).send({
      name: data.fields.name,
      email: data.fields.email,
      image: result.url,
    });
  }
};
