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
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mercadoPagoRoutes = express_1.Router();
// SDK de Mercado Pago
const mercadopago = require('mercadopago');
//middleware
//app.use(bodyParser.urlencoded({ extended: false }))
// Agrega credenciales
mercadopago.configure({
    access_token: 'APP_USR-283574749098658-060723-1b829d5f4133650feec0904cb6c57a59-772004350'
});
//routes
mercadoPagoRoutes.post('/mercadoPago', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Crea un objeto de preferencia
    const datosToken = req.usuario;
    const idUser = req.para;
    const nombre = yield queryPromess_1.default("SELECT PR.nombre as 'NOMBRE PRODUCTO' FROM DETALLES_PEDIDOS AS DP   " +
        "INNER JOIN PEDIDOS AS P ON P.id_pedido = DP.id_pedido    " +
        "INNER JOIN USUARIOS as U ON U.id_usuario = P.id_usuario    " +
        "INNER JOIN PRODUCTOS as PR ON PR.id_producto = DP.id_producto    " +
        "INNER JOIN ESTADOS as E ON p.id_estado = E.id_estado where u.id_usuario =?", [datosToken.id]);
    console.log(nombre);
    const precio = parseInt(req.body.precio);
    const queryOrders = "SELECT U.nombre as 'NOMBRE CLIENTE', U.apellido as 'APELLIDO CLIENTE'," +
        " U.documento as 'NRO_DOC', PR.nombre as 'NOMBRE PRODUCTO', DP.cantidad as 'CANTIDAD', DP.precio_unitario as 'PRECIO PRODUCTO'," +
        " DP.precio_total as 'PRECIO TOTAL POR CANTIDAD', DP.descuento as 'DESCUENTO',E.nombre as 'ESTADO', " +
        "P.fecha as 'FECHA PEDIDO' FROM DETALLES_PEDIDOS AS DP   " +
        "INNER JOIN PEDIDOS AS P ON P.id_pedido = DP.id_pedido    " +
        "INNER JOIN USUARIOS as U ON U.id_usuario = P.id_usuario    " +
        "INNER JOIN PRODUCTOS as PR ON PR.id_producto = DP.id_producto    " +
        "INNER JOIN ESTADOS as E ON p.id_estado = E.id_estado";
    let preference = {
        items: [
            {
                title: nombre,
                unit_price: precio,
                quantity: 1,
            }
        ],
    };
    mercadopago.preferences.create(preference)
        .then(function (res) {
        console.log(nombre);
        console.log(res.body);
        //res.redirect(res.body.init_point);
    }).catch(function (error) {
        console.log(error);
    });
}));
exports.default = mercadoPagoRoutes;
//server
// app.listen(3000, () => {
//     console.log("Server on port 3000");
// });
