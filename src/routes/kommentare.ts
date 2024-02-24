import {Router} from 'express';


const routerKommentare = Router();

import { getKommentare, createKommentare } from '../controllers/kommentare.controller'; 


routerKommentare.get('/kommentare/:id', getKommentare);
routerKommentare.post('/kommentare', createKommentare);


export default routerKommentare;