import { Request, Response, query } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import multer from "multer";

const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: "AKIA4MTWG67RWFDMQDZB",
    secretAccessKey: "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",
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const getLied = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM lied");

    return res.status(200).json(response.rows);
  } catch (error) {
    return res.status(200).json(`esta vuelta no funciona ${error}`);
  }
};

export const getLiedbyId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);

  try {
    const response: QueryResult = await pool.query(
      "SELECT * FROM lied WHERE id = $1",
      [id]
    );

    return res.json(response.rows);
  } catch (error) {
    return res.json("no esta funcionando");
  }
};

export const createLied = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, description, etappe, liedtext } = req.body;

  if (!req.files || !("image" in req.files) || !("audios" in req.files)) {
    return res.status(400).json({ error: "no image or audio updated" });
  }

  const fileImage = req.files["image"][0];
  const fileAudios = req.files["audios"];

  if (!name || !description || !etappe || !liedtext) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const imageParams = {
    Bucket: "beta-bucket-lieder",
    Key: `images/${Date.now().toString()}-${fileImage.originalname}`,
    Body: fileImage.buffer,
    ContentType: fileImage.mimetype,
    // ACL: 'public-read' as 'public-read',
  };

  const audioParams = fileAudios.map((files: Express.Multer.File) => ({
    Bucket: "beta-bucket-lieder",
    Key: `audios/${Date.now().toString()}-${files.originalname}`,
    Body: files.buffer,
    ContentType: files.mimetype,
  }));

  try {
    const [imageUploadResult, ...audioUploadResult] = await Promise.all([
      s3Client.send(new PutObjectCommand(imageParams)),
      ...audioParams.map((params) =>
        s3Client.send(new PutObjectCommand(params))
      ),
    ]);

    const audioUrl = audioUploadResult.map(
      (_, index) =>
        `https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/${
          audioParams[index] === null ? "" : audioParams[index].Key
        }`
    );
    const imageUrl = `https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/${
      imageParams === null ? "" : imageParams.Key
    }`;

    const response: QueryResult = await pool.query(
      "INSERT INTO lied (name, audios, description, img, etappe, liedtext) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, audioUrl, description, imageUrl, etappe, liedtext]
    );

    return res.json(`User erfolgreich erschafft`);
  } catch (error) {
    return res.json(error);
  }
};

export const updateLied = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      name,
      description,
      audios,
      img: oldImage,
      etappe,
      liedtext,
    } = req.body;
    const id = parseInt(req.params.id);
    if (!req.files || !("image" in req.files)) {
      return res.status(400).json({ error: "no image updated" });
    }
    const fileImage = req.files["image"][0];

    if (!name || !description || !etappe || !liedtext) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let existingLied: QueryResult;

    // try {
    //   existingLied = await pool.query(
    //     "SELECT img, audios FROM lied WHERE id=$1",
    //     [id]
    //   );
    // } catch (error) {
    //   return res.status(500).json({message: "error fetching existing Lied", error});
    // }

    // const currentImage = existingLied.rows[0].img;

    const deletePromise = [];
    if (oldImage) {
      deletePromise.push(
        s3Client.send(
          new DeleteObjectCommand({
            Bucket: "beta-bucket-lieder",
            Key: oldImage.split(
              "https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/"
            )[1],
          })
        )
      );
    }

    try {
      await Promise.all(deletePromise);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "error delating old files", error });
    }

    const imageParams = {
      Bucket: "beta-bucket-lieder",
      Key: `images/${Date.now().toString()}-${fileImage.originalname}`,
      Body: fileImage.buffer,
      ContentType: fileImage.mimetype,
      // ACL: 'public-read' as 'public-read',
    };

    const imageUpdate = await Promise.all([
      s3Client.send(new PutObjectCommand(imageParams)),
    ]);

    const imageUrl = `https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/${
      imageParams === null ? "" : imageParams.Key
    }`;

    const response: QueryResult = await pool.query(
      "UPDATE lied SET name = $1, description = $2, img = $3, etappe = $5, liedtext = $6 WHERE id = $4 ",
      [name, description, imageUrl, id, etappe, liedtext]
    );

    return res.json(`erfolgreich`);
  } catch (error) {
    return res.status(500).json({ message: "no funciona", error });
  }
};

export const deleteLied = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);

  const response: QueryResult = await pool.query(
    "DELETE FROM lied WHERE id = $1",
    [id]
  );

  return res.json("User wurde erfolgreich gelöscht");
};

export const deleteAudio = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { audio: oldAudio } = req.body;
  const id = parseInt(req.params.id);

  if (!oldAudio) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const deletePromise: any[] = [];
  if (oldAudio) {
    deletePromise.push(
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: "beta-bucket-lieder",
          Key: oldAudio.split(
            "https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/"
          )[1],
        })
      )
    );
  }

  try {
    await Promise.all(deletePromise);
  } catch (error) {
    return res.status(500).json({ message: "error delating old files", error });
  }

  try {
    const response: QueryResult = await pool.query(
      "UPDATE lied SET audios = array_remove(audios, $1) WHERE id = $2 ",
      [oldAudio, id]
    );

    if (response.rowCount === 0) {
      return res.status(404).json({ error: "Lied not found" });
    } else return res.json({ message: "aqui esta" });
  } catch (error) {
    return res.json({
      message: "wir kooenen dieses Audio nicht entfernen",
      error,
      id,
    });
  }
};

export const createAudio = async (req: Request, res: Response): Promise<Response> => {

  const id  = parseInt(req.params.id);

  if(!req.files || !("audio" in req.files)) {
    return res.json({message: "geben Sie ein File ein"})
  }

  const fileAudio = req.files["audio"][0];



  const audioParams = {
    Bucket: "beta-bucket-lieder",
    Key: `audios/${Date.now().toString()}-${fileAudio.originalname}`,
    Body: fileAudio.buffer,
    ContentType: fileAudio.mimetype,
  }

  try {
    const uploadAudio = await Promise.all([
      s3Client.send(new PutObjectCommand(audioParams))
  ]);

  const audioUrl = `https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/${
      audioParams === null ? "" : audioParams.Key
    }`

    const response: QueryResult = await pool.query("UPDATE lied SET audios = array_append(audios, $1) WHERE id = $2",
      [audioUrl, id]);

    return res.json("Todo bien");


  } catch(error) {

    return res.status(500).json({message: "das Audio konnte nicht hinzugefugt werden ", error})
  }
  
   
}
