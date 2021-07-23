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
const categoriesRoutes = express_1.Router();
//CARGAR CATEGORIAS Administrador
categoriesRoutes.post('/createCat', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_estado = '1';
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const datosToken = req.usuario;
    let queryCategoria = "INSERT INTO CATEGORIAS (id_estado, nombre, descripcion)  VALUES(?,?,?)";
    if (datosToken.idRol == '1') {
        if (nombre && descripcion != '') {
            yield queryPromess_1.default(queryCategoria, [id_estado, nombre, descripcion]);
            let commit = yield queryPromess_1.default("commit", []);
            res.json({
                estado: "Success",
                mensaje: "Categoria creada con Exito!",
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
categoriesRoutes.put('/editCat/:id', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datosToken = req.usuario;
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const newCategorie = {
        nombre,
        descripcion
    };
    if (datosToken.idRol == '1') {
        if (nombre && descripcion != '') {
            yield queryPromess_1.default('SELECT * FROM CATEGORIAS WHERE id_categoria = ?', [id]);
            yield queryPromess_1.default("UPDATE categorias set ? WHERE id_categoria = ?", [newCategorie, id]);
            let commit = yield queryPromess_1.default("commit", []);
            res.json({
                estado: "success",
                mensaje: "Categoria editada con exito",
                data: commit
            });
        }
        else {
            res.json({
                estado: "success",
                mensaje: "Debe completar todos los campos para poder editar una categoria",
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
categoriesRoutes.put('/deleteCat/:id', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datosToken = req.usuario;
    const { id } = req.params;
    if (datosToken.idRol == '1') {
        const categoria = yield queryPromess_1.default('SELECT * FROM CATEGORIAS WHERE id_categoria = ?', [id]);
        yield queryPromess_1.default("UPDATE categorias set id_estado='2' WHERE id_categoria = ?", [id]);
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
//BUSCAR CATEGORIAS POR ID
categoriesRoutes.get('/getCategoryById/:id', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const datosToken = req.usuario;
    if (datosToken.idRol == 1) {
        let category = yield queryPromess_1.default("Select * from categorias where id_categoria = ?", [id]);
        res.json({
            estado: "success",
            mensaje: "Se encontró la categoria",
            data: category
        });
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de Administrador"
        });
    }
}));
//BUSCAR TODAS LAS CATEGORIAS
categoriesRoutes.get('/getAllCategories', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let categories = yield queryPromess_1.default("Select * from categorias where id_estado = 1", []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron todas las categorias",
        data: categories
    });
}));
//BUSCAR CATEGORIAS POR NOMBRE
categoriesRoutes.get('/getCategoryName', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let categoryName = req.body.nombre;
    const datosToken = req.usuario;
    if (datosToken.idRol == 1) {
        let category = yield queryPromess_1.default("Select * from categorias where nombre like ?", ['%' + categoryName + '%']);
        res.json({
            estado: "success",
            mensaje: "Se encontró la categoria",
            data: category
        });
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de Administrador"
        });
    }
}));
exports.default = categoriesRoutes;
