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
const authentication_1 = require("../middlewares/authentication");
const queryPromess_1 = __importDefault(require("./queryPromess"));
const sizesRoutes = express_1.Router();
//CARGAR CATEGORIAS Administrador
sizesRoutes.post('/createSizes', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_estado = '1';
    const nombre = req.body.nombre;
    const ancho = req.body.ancho;
    const profundidad = req.body.profundidad;
    const alto = req.body.alto;
    const datosToken = req.usuario;
    let querySizes = "INSERT INTO TAMAÑOS (id_estado, nombre, ancho, profundidad, alto)  VALUES(?,?,?,?,?)";
    if (datosToken.idRol == '1') {
        if (nombre && ancho && profundidad && alto != '') {
            yield queryPromess_1.default(querySizes, [id_estado, nombre, ancho, profundidad, alto]);
            let commit = yield queryPromess_1.default("commit", []);
            res.json({
                estado: "Success",
                mensaje: "Nuevo tamaño creado con Exito!",
                data: commit
            });
        }
        else {
            res.json({
                estado: "Success",
                mensaje: "Debe completar todos los campos para continuar",
            });
        }
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        });
    }
}));
//EDITAR CATEGORIAS
sizesRoutes.put('/editSizes/:id', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datosToken = req.usuario;
    const { id } = req.params;
    const { nombre, ancho, profundidad, alto, } = req.body;
    const newSizes = {
        nombre,
        ancho,
        profundidad,
        alto
    };
    if (datosToken.idRol == '1') {
        if (nombre && ancho && profundidad && alto != '') {
            const sizes = yield queryPromess_1.default('SELECT * FROM TAMAÑOS WHERE id_tamaño = ?', [id]);
            yield queryPromess_1.default("UPDATE TAMAÑOS set ? WHERE id_tamaño = ?", [newSizes, id]);
            let commit = yield queryPromess_1.default("commit", []);
            res.json({
                estado: "success",
                mensaje: "Tamaño editado con exito",
                data: commit
            });
        }
        else {
            res.json({
                estado: "success",
                mensaje: "Debe completar todos los campos para poder editar un tamaño",
            });
        }
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        });
    }
}));
//EDITAR/ELIMINAR CATEGORIAS
sizesRoutes.put('/deleteSizes/:id', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datosToken = req.usuario;
    const { id } = req.params;
    if (datosToken.idRol == '1') {
        const sizes = yield queryPromess_1.default('SELECT * FROM TAMAÑOS WHERE id_tamaño = ?', [id]);
        yield queryPromess_1.default("UPDATE TAMAÑOS set id_estado='2' WHERE id_tamaño = ?", [id]);
        let commit = yield queryPromess_1.default("commit", []);
        res.json({
            estado: "success",
            mensaje: "Categoria eliminada con exito",
            data: commit
        });
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        });
    }
}));
//BUSCAR TAMAÑO POR ID
sizesRoutes.get('/getSizeById/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const datosToken = req.usuario;
    // if (datosToken.idRol == 1) {
    let size = yield queryPromess_1.default("Select * from tamaños where id_tamano = ?", [id]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el tamaño",
        data: size
    });
    // } else {
    // res.json({
    //     estado: "Error",
    //    mensaje: "No tenes permisos de Administrador"
    // })
    // }
}));
//BUSCAR TAMAÑO POR NOMBRE
sizesRoutes.get('/getSizeName', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let sizeName = req.body.nombre;
    const datosToken = req.usuario;
    if (datosToken.idRol == 1) {
        let size = yield queryPromess_1.default("Select * from tamaños where nombre like ?", ['%' + sizeName + '%']);
        res.json({
            estado: "success",
            mensaje: "Se encontró el tamaño",
            data: size
        });
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de Administrador"
        });
    }
}));
//BUSCAR TODAS LOS TAMAÑOS
sizesRoutes.get('/getAllSizes', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let sizes = yield queryPromess_1.default("Select * from tamaños where id_estado = 1", []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron todos los tamaños",
        data: sizes
    });
}));
exports.default = sizesRoutes;
