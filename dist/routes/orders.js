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
//OBTENER PEDIDO POR ID
orderRoutes.get('/getOrderById', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let orderId = req.body.id_pedido;
    let order = yield queryPromess_1.default("Select * from pedidos where id_pedido = ?", [orderId]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el pedido",
        data: order
    });
}));
//OBTENER PEDIDO POR ESTADO
orderRoutes.get('/getOrderByStatus', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let orderStatusId = req.body.id_estado;
    let orders = yield queryPromess_1.default("Select * from pedidos where id_estado = ?", [orderStatusId]);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los pedidos",
        data: orders
    });
}));
//OBTENER PEDIDOS POR USUARIO
orderRoutes.get('/getOrderByUser', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datosToken = req.usuario;
    const userId = datosToken.id;
    let orders = yield queryPromess_1.default("Select * from pedidos where id_usuario = ?", [userId]);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los pedidos para el usuario",
        data: orders
    });
}));
//OBTENER TODOS LOS PEDIDOS Administrador
orderRoutes.get('/getAllOrders', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datosToken = req.usuario;
    if (datosToken.idRol == '1') {
        let orders = yield queryPromess_1.default("Select * from pedidos where id_estado = 1", []);
        res.json({
            estado: "success",
            mensaje: "Se encontraron los pedidos",
            data: orders
        });
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        });
    }
}));
//CARGAR PEDIDO
orderRoutes.post('/createOrder', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const datosToken = req.usuario;
        const id_usuario = datosToken.id;
        const id_estado = '1';
        const fecha = new Date();
        let queryTransaction = "START TRANSACTION";
        let queryOrder = "INSERT INTO PEDIDOS (id_usuario, id_estado, fecha)  VALUES(?,?,?)";
        yield queryPromess_1.default(queryTransaction, []);
        let insertOrder = yield queryPromess_1.default(queryOrder, [id_usuario, id_estado, fecha]);
        yield queryPromess_1.default("commit", []);
        res.json({
            estado: "Success",
            mensaje: "Pedido creado con exito",
            data: insertOrder
        });
    }
    catch (error) {
        yield queryPromess_1.default("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo crear el pedido",
            data: error
        });
    }
}));
//EDITAR ESTADO DEL PEDIDO
orderRoutes.put('/editOrderStatus/:id', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datosToken = req.usuario;
    const { id } = req.params;
    const id_estado = req.body.id_estado;
    if (datosToken.idRol == '1') {
        yield queryPromess_1.default(`UPDATE pedidos set id_estado= ${id_estado} WHERE id_pedido = ${id}`, []);
        let commit = yield queryPromess_1.default("commit", []);
        res.json({
            estado: "success",
            mensaje: "Pedido editado con exito",
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
exports.default = orderRoutes;
