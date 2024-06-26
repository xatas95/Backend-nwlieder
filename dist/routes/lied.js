"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const lied_controller_1 = require("../controllers/lied.controller");
router.get('/lied', lied_controller_1.getLied);
router.get('/lied/:id', lied_controller_1.getLiedbyId);
router.post('/lied', upload.fields([{ name: "image", maxCount: 1 }, { name: "audios", maxCount: 4 }]), lied_controller_1.createLied);
router.put('/lied/:id', upload.fields([{ name: 'image', maxCount: 1 }]), lied_controller_1.updateLied);
router.put('/audio/:id', lied_controller_1.deleteAudio);
router.put('/audioCreate/:id', upload.fields([{ name: "audio", maxCount: 1 }]), lied_controller_1.createAudio);
router.delete('/lied/:id', lied_controller_1.deleteLied);
exports.default = router;
