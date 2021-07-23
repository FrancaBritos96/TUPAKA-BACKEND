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
const orderRoutes = express_1.Router();
orderRoutes.get('/getProductById', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let productId = req.body.id_producto;
    let product = yield queryPromess_1.default("Select * from productos where id_producto = ?", [productId]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el producto",
        data: product
    });
}));
orderRoutes.get('/getAllProducts', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let products = yield queryPromess_1.default("Select * from productos where id_estado = 1", []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los productos",
        data: products
    });
}));
orderRoutes.post('/createProduct', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id_categoria = body.id_categoria;
        const id_estado = body.id_estado;
        const id_tamaño = body.id_tamaño;
        const nombre = body.nombre;
        const descripcion = body.descripcion;
        const precio = body.precio;
        const stock = body.stock;
        let queryTransaction = "START TRANSACTION";
        let queryProduct = "INSERT INTO PRODUCTOS (id_categoria, id_estado, id_tamaño, nombre, descripcion, precio, stock)  VALUES(?,?,?,?,?,?,?)";
        yield queryPromess_1.default(queryTransaction, []);
        let insertProduct = yield queryPromess_1.default(queryProduct, [id_categoria, id_estado, id_tamaño, nombre, descripcion, precio, stock]);
        yield queryPromess_1.default("commit", []);
        res.json({
            estado: "Success",
            mensaje: "Producto creado con exito",
            data: insertProduct
        });
    }
    catch (error) {
        yield queryPromess_1.default("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo crear el producto",
            data: error
        });
    }
}));
exports.default = orderRoutes;
