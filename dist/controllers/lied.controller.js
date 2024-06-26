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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAudio = exports.deleteAudio = exports.deleteLied = exports.updateLied = exports.createLied = exports.getLiedbyId = exports.getLied = void 0;
const database_1 = require("../database");
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const s3Client = new client_s3_1.S3Client({
    region: "eu-central-1",
    credentials: {
        accessKeyId: "AKIA4MTWG67RWFDMQDZB",
        secretAccessKey: "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",
    },
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const getLied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query("SELECT * FROM lied");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        return res.status(200).json(`esta vuelta no funciona ${error}`);
    }
});
exports.getLied = getLied;
const getLiedbyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const response = yield database_1.pool.query("SELECT * FROM lied WHERE id = $1", [id]);
        return res.json(response.rows);
    }
    catch (error) {
        return res.json("no esta funcionando");
    }
});
exports.getLiedbyId = getLiedbyId;
const createLied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, etappe, liedtext } = req.body;
    if (!req.files || !("image" in req.files) || !("audios" in req.files)) {
        return res.status(400).json({ error: "no image or audio updated" });
    }
    const fileImage = req.files["image"][0];
    const fileAudios = req.files["audios"];
    if (!name || !description || !etappe || !liedtext) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const imageParams = {
        Bucket: "beta-bucket-lieder",
        Key: `images/${Date.now().toString()}-${fileImage.originalname}`,
        Body: fileImage.buffer,
        ContentType: fileImage.mimetype,
        // ACL: 'public-read' as 'public-read',
    };
    const audioParams = fileAudios.map((files) => ({
        Bucket: "beta-bucket-lieder",
        Key: `audios/${Date.now().toString()}-${files.originalname}`,
        Body: files.buffer,
        ContentType: files.mimetype,
    }));
    try {
        const [imageUploadResult, ...audioUploadResult] = yield Promise.all([
            s3Client.send(new client_s3_1.PutObjectCommand(imageParams)),
            ...audioParams.map((params) => s3Client.send(new client_s3_1.PutObjectCommand(params))),
        ]);
        const audioUrl = audioUploadResult.map((_, index) => `https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/${audioParams[index] === null ? "" : audioParams[index].Key}`);
        const imageUrl = `https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/${imageParams === null ? "" : imageParams.Key}`;
        const response = yield database_1.pool.query("INSERT INTO lied (name, audios, description, img, etappe, liedtext) VALUES ($1, $2, $3, $4, $5, $6)", [name, audioUrl, description, imageUrl, etappe, liedtext]);
        return res.json(`User erfolgreich erschafft`);
    }
    catch (error) {
        return res.json(error);
    }
});
exports.createLied = createLied;
const updateLied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, audios, img: oldImage, etappe, liedtext, } = req.body;
        const id = parseInt(req.params.id);
        if (!req.files || !("image" in req.files)) {
            return res.status(400).json({ error: "no image updated" });
        }
        const fileImage = req.files["image"][0];
        if (!name || !description || !etappe || !liedtext) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let existingLied;
        // try {
        //   existingLied = await pool.query(
        //     "SELECT img, audios FROM lied WHERE id=$1",
        //     [id]
        //   );
        // } catch (error) {
        //   return res.status(500).json({message: "error fetching existing Lied", error});
        // }
        // const currentImage = existingLied.rows[0].img;
        const deletePromise = [];
        if (oldImage) {
            deletePromise.push(s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: "beta-bucket-lieder",
                Key: oldImage.split("https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/")[1],
            })));
        }
        try {
            yield Promise.all(deletePromise);
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "error delating old files", error });
        }
        const imageParams = {
            Bucket: "beta-bucket-lieder",
            Key: `images/${Date.now().toString()}-${fileImage.originalname}`,
            Body: fileImage.buffer,
            ContentType: fileImage.mimetype,
            // ACL: 'public-read' as 'public-read',
        };
        const imageUpdate = yield Promise.all([
            s3Client.send(new client_s3_1.PutObjectCommand(imageParams)),
        ]);
        const imageUrl = `https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/${imageParams === null ? "" : imageParams.Key}`;
        const response = yield database_1.pool.query("UPDATE lied SET name = $1, description = $2, img = $3, etappe = $5, liedtext = $6 WHERE id = $4 ", [name, description, imageUrl, id, etappe, liedtext]);
        return res.json(`erfolgreich`);
    }
    catch (error) {
        return res.status(500).json({ message: "no funciona", error });
    }
});
exports.updateLied = updateLied;
const deleteLied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const response = yield database_1.pool.query("DELETE FROM lied WHERE id = $1", [id]);
    return res.json("User wurde erfolgreich gelöscht");
});
exports.deleteLied = deleteLied;
const deleteAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { audio: oldAudio } = req.body;
    const id = parseInt(req.params.id);
    if (!oldAudio) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const deletePromise = [];
    if (oldAudio) {
        deletePromise.push(s3Client.send(new client_s3_1.DeleteObjectCommand({
            Bucket: "beta-bucket-lieder",
            Key: oldAudio.split("https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/")[1],
        })));
    }
    try {
        yield Promise.all(deletePromise);
    }
    catch (error) {
        return res.status(500).json({ message: "error delating old files", error });
    }
    try {
        const response = yield database_1.pool.query("UPDATE lied SET audios = array_remove(audios, $1) WHERE id = $2 ", [oldAudio, id]);
        if (response.rowCount === 0) {
            return res.status(404).json({ error: "Lied not found" });
        }
        else
            return res.json({ message: "aqui esta" });
    }
    catch (error) {
        return res.json({
            message: "wir kooenen dieses Audio nicht entfernen",
            error,
            id,
        });
    }
});
exports.deleteAudio = deleteAudio;
const createAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (!req.files || !("audio" in req.files)) {
        return res.json({ message: "geben Sie ein File ein" });
    }
    const fileAudio = req.files["audio"][0];
    const audioParams = {
        Bucket: "beta-bucket-lieder",
        Key: `audios/${Date.now().toString()}-${fileAudio.originalname}`,
        Body: fileAudio.buffer,
        ContentType: fileAudio.mimetype,
    };
    try {
        const uploadAudio = yield Promise.all([
            s3Client.send(new client_s3_1.PutObjectCommand(audioParams))
        ]);
        const audioUrl = `https://beta-bucket-lieder.s3.eu-central-1.amazonaws.com/${audioParams === null ? "" : audioParams.Key}`;
        const response = yield database_1.pool.query("UPDATE lied SET audios = array_append(audios, $1) WHERE id = $2", [audioUrl, id]);
        return res.json("Todo bien");
    }
    catch (error) {
        return res.status(500).json({ message: "das Audio konnte nicht hinzugefugt werden ", error });
    }
});
exports.createAudio = createAudio;
