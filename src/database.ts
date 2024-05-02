import {Pool} from 'pg';


export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "Tu1ta2loco3",
    database: "lieder",
    port: 5432
})
