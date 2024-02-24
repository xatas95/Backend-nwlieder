"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lied_1 = __importDefault(require("./routes/lied"));
const kommentare_1 = __importDefault(require("./routes/kommentare"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use(lied_1.default, kommentare_1.default);
app.listen(5000, () => {
    console.log('backend');
});
