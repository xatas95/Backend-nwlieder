import {Request, Response, response} from "express";
import { QueryResult } from "pg";
import { pool } from "../database";


export const getKommentare = async (req: Request, res: Response): Promise<Response> => {
  
    const id = parseInt(req.params.id)
    try {
        const response:QueryResult = await pool.query('SELECT * FROM kommentare where id_lied = $1', [
            id
        ])

        return res.json(response.rows);
    }

    catch (error) {
       return res.json("wir haben diesen kommentar nicht gefunden")
    }
}

export const createKommentare = async (req: Request, res: Response): Promise<Response> => {

    const { id_lied, name, description } = req.body;

    try {

    const response:QueryResult = await pool.query('INSERT INTO kommentare (id_lied, name, description) VALUES ($1, $2, $3)', [
        id_lied, name, description
    ])

    return res.json(response);
} catch (error){

    return res.json(error)
}
}