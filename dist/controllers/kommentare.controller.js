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
exports.createKommentare = exports.getKommentare = void 0;
const database_1 = require("../database");
const getKommentare = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const response = yield database_1.pool.query('SELECT * FROM kommentare where id_lied = $1', [
            id
        ]);
        return res.json(response.rows);
    }
    catch (error) {
        return res.json("wir haben diesen kommentar nicht gefunden");
    }
});
exports.getKommentare = getKommentare;
const createKommentare = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_lied, name, description } = req.body;
    try {
        const response = yield database_1.pool.query('INSERT INTO kommentare (id_lied, name, description) VALUES ($1, $2, $3)', [
            id_lied, name, description
        ]);
        return res.json(response);
    }
    catch (error) {
        return res.json(error);
    }
});
exports.createKommentare = createKommentare;
