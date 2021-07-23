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
const orderDetailRoutes = express_1.Router();
//OBTENER DETALLE DE PEDIDO POR ID
orderDetailRoutes.get('/getOrderDetailById', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let orderDetailId = req.body.id_detalle_pedido;
    let orderDetail = yield queryPromess_1.default("Select * from detalles_pedidos where id_detalle_pedido = ?", [orderDetailId]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el detalle de pedido",
        data: orderDetail
    });
}));
//OBTENER DETALLE DE PEDIDO POR ID DE PEDIDO
orderDetailRoutes.get('/getOrderDetailByOrderId', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let orderId = req.body.id_pedido;
    let orderDetails = yield queryPromess_1.default("Select * from detalles_pedidos where id_pedido = ?", [orderId]);
    res.json({
        estado: "success",
        mensaje: "Se encontró los detalles de pedido por id_pedido",
        data: orderDetails
    });
}));
//OBTENER TODOS LOS DETALLES DE PEDIDO Administrador
orderDetailRoutes.get('/getAllOrderDetails', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datosToken = req.usuario;
    if (datosToken.idRol == '1') {
        let orderDetails = yield queryPromess_1.default("Select * from detalles_pedidos where id_estado = 1", []);
        res.json({
            estado: "success",
            mensaje: "Se encontraron detalles de pedido",
            data: orderDetails
        });
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        });
    }
}));
//CARGAR DETALLE DE PEDIDO
orderDetailRoutes.post('/createOrderDetail', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id_pedido = body.id_pedido;
        const id_producto = body.id_producto;
        const id_estado = '1';
        const cantidad = body.cantidad;
        const descuento = '0';
        let queryTransaction = "START TRANSACTION";
        let queryProduct = "SELECT * FROM PRODUCTOS WHERE ID_PRODUCTO = ?";
        let queryOrderDetail = "INSERT INTO DETALLES_PEDIDOS (ID_PEDIDO, ID_PRODUCTO, ID_ESTADO, CANTIDAD, PRECIO_UNITARIO, PRECIO_TOTAL, DESCUENTO)  VALUES(?,?,?,?,?,?,?)";
        yield queryPromess_1.default(queryTransaction, []);
        let product = yield queryPromess_1.default(queryProduct, [id_producto]);
        const newProductStock = product[0].stock - cantidad;
        let queryNewProductStock = `UPDATE PRODUCTOS set STOCK = ${newProductStock} WHERE ID_PRODUCTO = ?`;
        if (cantidad <= product[0].stock && cantidad > 0) {
            const precio_unitario = product[0].precio;
            const precioTotal = cantidad * precio_unitario;
            let insertOrderDetail = yield queryPromess_1.default(queryOrderDetail, [id_pedido, id_producto, id_estado, cantidad, precio_unitario, precioTotal, descuento]);
            yield queryPromess_1.default(queryNewProductStock, [id_producto]);
            yield queryPromess_1.default("commit", []);
            res.json({
                estado: "Success",
                mensaje: "Detalle de pedido creado con exito",
                data: insertOrderDetail
            });
        }
        else {
            res.json({
                estado: "error",
                mensaje: "No hay stock suficiente de este producto",
                data: id_producto
            });
        }
    }
    catch (error) {
        yield queryPromess_1.default("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo crear el detalle de pedido",
            data: error
        });
    }
}));
//EDITAR DETALLE DE PEDIDO
orderDetailRoutes.put('/editOrderDetailCantidad', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const datosToken = req.usuario;
        if (datosToken.idRol == '1') {
            let { id_detalle_pedido, id_pedido, id_producto, id_estado, cantidad, precio_unitario, precioTotal, descuento } = req.body;
            let queryTransaction = "START TRANSACTION";
            yield queryPromess_1.default(queryTransaction, []);
            let queryOrdeDetail = "SELECT * FROM DETALLES_PEDIDOS WHERE ID_DETALLE_PEDIDO = ?";
            let orderDetail = yield queryPromess_1.default(queryOrdeDetail, [id_detalle_pedido]);
            if (orderDetail[0].cantidad != cantidad) {
                precioTotal = precio_unitario * cantidad;
            }
            if (orderDetail[0].id_estado != id_estado) {
                let queryOrderDetails = "SELECT * FROM DETALLES_PEDIDOS WHERE ID_PEDIDO = ?";
                let orderDetails = yield queryPromess_1.default(queryOrderDetails, [id_pedido]);
                let existActiveOrderDetail = false;
                for (let i = 0; i < orderDetails.length; i++) {
                    if (orderDetails[i].id_estado == '1' && !existActiveOrderDetail && orderDetails[i].id_detalle_pedido != id_detalle_pedido) {
                        existActiveOrderDetail = true;
                    }
                }
                if (!existActiveOrderDetail) {
                    // let queryOrder = "SELECT * FROM PEDIDOS WHERE ID_PEDIDO = ?";
                    // let order: any = await query(queryOrder, [id_pedido]);
                    yield queryPromess_1.default("UPDATE PEDIDOS set ID_ESTADO = '2' WHERE id_PEDIDO = ?", [id_pedido]);
                }
            }
            const newOrderDetail = {
                id_pedido,
                id_producto,
                id_estado,
                cantidad,
                precio_unitario,
                precioTotal,
                descuento
            };
            let updatedOrderDetail = yield queryPromess_1.default("UPDATE detalles_pedidos set ? WHERE id_detalle_pedido = ?", [newOrderDetail, id_detalle_pedido]);
            yield queryPromess_1.default("commit", []);
            res.json({
                estado: "success",
                mensaje: "Detalle de pedido editado con exito",
                data: updatedOrderDetail
            });
        }
        else {
            res.json({
                estado: "Error",
                mensaje: "No tienes permisos de Administrador",
            });
        }
    }
    catch (error) {
        yield queryPromess_1.default("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo modificar el detalle de pedido",
            data: error
        });
    }
}));
exports.default = orderDetailRoutes;
