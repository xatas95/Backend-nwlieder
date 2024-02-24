import { Request, Response, query } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";

export  const getLied = async (req: Request, res: Response): Promise<Response> => {


    try {
    const response: QueryResult = await pool.query('SELECT * FROM lied');
    
    return res.status(200).json(response.rows);
    }

    catch (error) {
        return res.status(200).json('esta vuelta no funciona')
        console.log(error);
    }


}

export const getLiedbyId = async (req: Request, res: Response): Promise<Response> => {

    const id = parseInt(req.params.id);

    try {

    const response: QueryResult = await pool.query('SELECT * FROM lied WHERE id = $1', [id])

    return res.json(response.rows)
    }

    catch (error) {

     return    res.json('no esta funcionando')
    }

}

export const createLied = async (req: Request, res: Response ): Promise<Response> => {


    const { name, mp3, description, img, etappe, favorite} = req.body;

    try {

    const response: QueryResult = await 
    pool.query('INSERT INTO lied (name, mp3, description, img, etappe, favorite) VALUES ($1, $2, $3, $4, $5, $6)', [
        name, mp3, description, img, etappe, favorite
    ]);

    return res.json(`User erfolgreich erschafft`);
} catch (error) {

    return res.json(error);
}



}

export const updateLied = async (req: Request, res: Response): Promise<Response> => {

    try {

    const { name, mp3, description, img, categorie, favorite, kommentare } = req.body;
    const id = parseInt(req.params.id)

    const response: QueryResult = await
     pool.query('UPDATE lied SET name = $1, mp3 = $2, description = $3, img = $4, categorie = $6, favorite = $7, kommentare = array_append(kommentare, $8) WHERE id = $5 ', [
        name, mp3, description, img, id, categorie, favorite, kommentare
    ])

    return res.json(`Lied nummer ${id} erfolgreich aktualisiert`)
}
catch (error) {
    console.log(`que ha pasado aqui ${error}`)
    return res.status(200).json('no funciona')
}   
}

export const deleteLied = async (req: Request, res: Response): Promise<Response> => {

    const id = parseInt(req.params.id);

    const response: QueryResult = await pool.query(`DELETE FROM lied WHERE id = $1`, [
        id
    ])

    return res.json('User wurde erfolgreich gelöscht')
}