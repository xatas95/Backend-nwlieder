import express, { urlencoded } from "express";
import IndexRoutes from "./routes/lied";

import multerS3 from "multer-s3";
import mysql from "mysql2";
import IndexRoutesKommentare from './routes/kommentare'
import cors from "cors";

require("dotenv").config();





const app = express();
const port = 5000;


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors());

app.use(IndexRoutes, IndexRoutesKommentare)


app.listen(port, () => {
    console.log('backend')
} )