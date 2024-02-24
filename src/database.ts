import {Pool} from 'pg';


export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "790852",
    database: "nwlieder",
    port: 5432
})