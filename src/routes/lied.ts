import {Router} from "express";

const router = Router();


import { createLied, deleteLied, getLied, getLiedbyId, updateLied } from "../controllers/lied.controller";


router.get('/lied', getLied);
router.get('/lied/:id', getLiedbyId)
router.post('/lied', createLied)
router.put('/lied/:id', updateLied)
router.delete('/lied/:id', deleteLied)




export default router;