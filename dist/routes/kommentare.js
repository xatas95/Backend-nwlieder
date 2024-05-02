"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerKommentare = (0, express_1.Router)();
const kommentare_controller_1 = require("../controllers/kommentare.controller");
routerKommentare.get('/kommentare/:id', kommentare_controller_1.getKommentare);
routerKommentare.post('/kommentare', kommentare_controller_1.createKommentare);
routerKommentare.delete('/kommentare/:id', kommentare_controller_1.deleteKommentare);
exports.default = routerKommentare;
