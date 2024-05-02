import {Router} from 'express';


const routerKommentare = Router();

import { getKommentare, createKommentare, deleteKommentare } from '../controllers/kommentare.controller'; 


routerKommentare.get('/kommentare/:id', getKommentare);
routerKommentare.post('/kommentare', createKommentare);
routerKommentare.delete('/kommentare/:id', deleteKommentare)


export default routerKommentare;