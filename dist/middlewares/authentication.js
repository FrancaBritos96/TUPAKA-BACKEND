"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = void 0;
const token_1 = __importDefault(require("../clases/token"));
const verificarToken = (req, res, next) => {
    const userToken = req.get('x-token') || "";
    token_1.default.checkToken(userToken).then(decoded => {
        req.usuario = decoded.usuario;
        const refreshToken = token_1.default.getToken(decoded.usuario);
        req.token = refreshToken;
        next();
    })
        .catch(error => {
        res.json({
            estado: "success",
            mensaje: "Token incorrecto",
            error: error
        });
    });
};
exports.verificarToken = verificarToken;
