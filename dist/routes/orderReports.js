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
const ventasRoutes = express_1.Router();
//BUSCAR VENTAS POR ESTADO
const queryOrders = "SELECT U.nombre as 'NOMBRE_CLIENTE', U.apellido as 'APELLIDO_CLIENTE'," +
    " U.documento as 'NRO_DOC', PR.nombre as 'NOMBRE_PRODUCTO', DP.cantidad as 'CANTIDAD', DP.precio_unitario as 'PRECIO_PRODUCTO'," +
    " DP.precio_total as 'PRECIO_TOTAL_POR_CANTIDAD', DP.descuento as 'DESCUENTO',E.nombre as 'ESTADO', " +
    "P.fecha as 'FECHA_PEDIDO' FROM DETALLES_PEDIDOS AS DP   " +
    "INNER JOIN PEDIDOS AS P ON P.id_pedido = DP.id_pedido    " +
    "INNER JOIN USUARIOS as U ON U.id_usuario = P.id_usuario    " +
    "INNER JOIN PRODUCTOS as PR ON PR.id_producto = DP.id_producto    " +
    "INNER JOIN ESTADOS as E ON p.id_estado = E.id_estado";
ventasRoutes.get('/getVentasEstado', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estadoVenta = req.body.estado;
    const datosToken = req.usuario;
    if (datosToken.idRol == 1) {
        if (estadoVenta != '') {
            if (estadoVenta == 'TODAS') {
                let ventas = yield queryPromess_1.default(queryOrders, []);
                res.json({
                    estado: "success",
                    mensaje: "Listado de VENTAS",
                    data: ventas
                });
            }
            else {
                let ventas = yield queryPromess_1.default(queryOrders + " where E.nombre = ?", [estadoVenta]);
                res.json({
                    estado: "success",
                    mensaje: "Listado de VENTAS",
                    data: ventas
                });
            }
        }
        else {
            res.json({
                estado: "Error",
                mensaje: "Debe seleccionar un ESTADO",
            });
        }
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de administrador",
        });
    }
}));
//BUSCAR VENTAS POR RANGO DE FECHAS
ventasRoutes.get('/getVentasFecha', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let fechaDesde = req.body.fechaDesde;
    let fechaHasta = req.body.fechaHasta;
    const datosToken = req.usuario;
    if (datosToken.idRol == 1) {
        if (fechaDesde && fechaHasta != '') {
            let ventas = yield queryPromess_1.default(queryOrders + " where p.fecha between  ? and ?", [fechaDesde, fechaHasta]);
            res.json({
                estado: "success",
                mensaje: "Listado de VENTAS",
                data: ventas
            });
        }
        else {
            res.json({
                estado: "Error",
                mensaje: "Debe seleccionar una fecha",
            });
        }
    }
    else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de administrador",
        });
    }
}));
//BUSCAR TODAS LAS VENTAS
ventasRoutes.get('/getAllVentas', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let ventas = yield queryPromess_1.default(queryOrders, []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron todos los registro de ventas",
        data: ventas
    });
}));
exports.default = ventasRoutes;
