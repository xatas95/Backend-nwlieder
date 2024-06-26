import {Router} from "express";
import multer from "multer";
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { createLied, deleteLied, getLied, getLiedbyId, updateLied, deleteAudio, createAudio } from "../controllers/lied.controller";


router.get('/lied', getLied);
router.get('/lied/:id', getLiedbyId)

router.post('/lied', upload.fields([{name: "image", maxCount: 1}, {name: "audios", maxCount: 4}]), createLied)
router.put('/lied/:id', upload.fields([{name: 'image', maxCount: 1}]), updateLied)
router.put('/audio/:id', deleteAudio)
router.put('/audioCreate/:id', upload.fields([{name: "audio", maxCount: 1}]), createAudio)
router.delete('/lied/:id', deleteLied)




export default router;