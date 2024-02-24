import express, { urlencoded } from "express";
import IndexRoutes from "./routes/lied";
import IndexRoutesKommentare from './routes/kommentare'
import cors from "cors";


const app = express();


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors());

app.use(IndexRoutes, IndexRoutesKommentare)


app.listen(5000, () => {
    console.log('backend')
} )