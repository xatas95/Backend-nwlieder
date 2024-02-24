"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLied = exports.updateLied = exports.createLied = exports.getLiedbyId = exports.getLied = void 0;
const database_1 = require("../database");
const getLied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT * FROM lied');
        return res.status(200).json(response.rows);
    }
    catch (error) {
        return res.status(200).json('esta vuelta no funciona');
        console.log(error);
    }
});
exports.getLied = getLied;
const getLiedbyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const response = yield database_1.pool.query('SELECT * FROM lied WHERE id = $1', [id]);
        return res.json(response.rows);
    }
    catch (error) {
        return res.json('no esta funcionando');
    }
});
exports.getLiedbyId = getLiedbyId;
const createLied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, mp3, description, img, etappe, favorite } = req.body;
    try {
        const response = yield database_1.pool.query('INSERT INTO lied (name, mp3, description, img, etappe, favorite) VALUES ($1, $2, $3, $4, $5, $6)', [
            name, mp3, description, img, etappe, favorite
        ]);
        return res.json(`User erfolgreich erschafft`);
    }
    catch (error) {
        return res.json(error);
    }
});
exports.createLied = createLied;
const updateLied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, mp3, description, img, categorie, favorite, kommentare } = req.body;
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('UPDATE lied SET name = $1, mp3 = $2, description = $3, img = $4, categorie = $6, favorite = $7, kommentare = array_append(kommentare, $8) WHERE id = $5 ', [
            name, mp3, description, img, id, categorie, favorite, kommentare
        ]);
        return res.json(`Lied nummer ${id} erfolgreich aktualisiert`);
    }
    catch (error) {
        console.log(`que ha pasado aqui ${error}`);
        return res.status(200).json('no funciona');
    }
});
exports.updateLied = updateLied;
const deleteLied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const response = yield database_1.pool.query(`DELETE FROM lied WHERE id = $1`, [
        id
    ]);
    return res.json('User wurde erfolgreich gelöscht');
});
exports.deleteLied = deleteLied;
