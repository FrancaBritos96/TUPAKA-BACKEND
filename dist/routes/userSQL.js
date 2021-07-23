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
const express_1 = require("express");
const queryPromess_1 = __importDefault(require("./queryPromess"));
const userSQLRoutes = express_1.Router();
userSQLRoutes.get('/consultarUsuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let numero_documento = req.body.numero_documento;
    let persona = yield queryPromess_1.default("Select * from personas where numero_documento = ?", [numero_documento]);
    res.json({
        data: persona
    });
}));
userSQLRoutes.post('/createUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const nombre = body.nombre;
        const apellido = body.apellido;
        const tipo_documento = body.tipo_documento;
        const numero_documento = body.numero_documento;
        const nombre_usuario = body.nombre_usuario;
        const password = body.password;
        let queryTransaction = "START TRANSACTION";
        let queryPersona = "INSERT INTO PERSONAS(nombre, apellido, tipo_documento, numero_documento) VALUES(?,?,?,?)";
        let queryUsuario = "INSERT INTO USUARIOS(id_usuario, nombre_usuario, password) VALUES(?,?,?)";
        yield queryPromess_1.default(queryTransaction, []);
        let insertarPersona = yield queryPromess_1.default(queryPersona, [nombre, apellido, tipo_documento, numero_documento]);
        yield queryPromess_1.default(queryUsuario, [insertarPersona.insertId, nombre_usuario, password]);
        let commit = yield queryPromess_1.default("commit", []);
        res.json({
            estado: "Success",
            mensaje: "Persona y Usuario creados con exito",
            data: commit
        });
    }
    catch (error) {
        yield queryPromess_1.default("rollback", []);
        res.json({
            estado: "error",
            data: error
        });
    }
}));
exports.default = userSQLRoutes;
