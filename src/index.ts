import express, { urlencoded } from "express";
import IndexRoutes from "./routes/lied";
import IndexRoutesKommentare from './routes/kommentare'
import cors from "cors";


const app = express();
const port = 5000;


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors());

app.use(IndexRoutes, IndexRoutesKommentare)


app.listen(port, () => {
    console.log('backend')
} )