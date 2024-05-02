import { Request, Response, response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";

export const getKommentare = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);
  try {
    const response: QueryResult = await pool.query(
      "SELECT * FROM kommentare where id_lied = $1",
      [id]
    );

    return res.json(response.rows);
  } catch (error) {
    return res.json("wir haben diesen kommentar nicht gefunden");
  }
};

export const createKommentare = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id_lied, name, description, audio_id } = req.body;

  try {
    const response: QueryResult = await pool.query(
      "INSERT INTO kommentare (id_lied, name, description, audio_id) VALUES ($1, $2, $3, $4)",
      [id_lied, name, description, audio_id]
    );

    return res.json(response);
  } catch (error) {
    return res.json(error);
  }
};

export const deleteKommentare = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);
  const response: QueryResult = await pool.query(
    "DELETE FROM kommentare WHERE id= $1",
    [id]
  );

  return res.json("Der Kommentar wurde erfolgreich geloescht");
};
