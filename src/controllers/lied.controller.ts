import { Request, Response, query } from "express";
import { QueryResult } from "pg";
import { pool } from "../database"; 

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
  const { name, audios, description, img, etappe, favorite, liedtext } = req.body;

  try {
    const response: QueryResult = await pool.query(
      "INSERT INTO lied (name, audios, description, img, etappe, favorite, liedtext) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [name, audios, description, img, etappe, favorite, liedtext]
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
      audios,
      description,
      img,
      favorite,
      etappe,
      liedtext,
    } = req.body;
    const id = parseInt(req.params.id);

    const response: QueryResult = await pool.query(
      "UPDATE lied SET name = $1, audios = $2, description = $3, img = $4, favorite = $6, etappe = $7, liedtext = $8 WHERE id = $5 ",
      [name, audios, description, img, id, favorite, etappe, liedtext]
    );

    return res.json(`erfolgreich`);
  } catch (error) {
    console.log(`que ha pasado aqui ${error}`);
    return res.status(200).json("no funciona");
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