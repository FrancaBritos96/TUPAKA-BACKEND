import { Router, Request, Response } from 'express';
import Token from '../clases/token';
import { verificarToken } from '../middlewares/authentication'
import jwt from 'jsonwebtoken';
import query from './queryPromess';
import usuarios from '../controllers/usuario'
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import FileSystem from '../clases/file-system';
import { IfileUpload } from '../interfaces/file-upload';

const ventasRoutes = Router();
//BUSCAR VENTAS POR ESTADO

const queryOrders = "SELECT U.nombre as 'NOMBRE_CLIENTE', U.apellido as 'APELLIDO_CLIENTE'," +
" U.documento as 'NRO_DOC', PR.nombre as 'NOMBRE_PRODUCTO', DP.cantidad as 'CANTIDAD', DP.precio_unitario as 'PRECIO_PRODUCTO',"+
" DP.precio_total as 'PRECIO_TOTAL_POR_CANTIDAD', DP.descuento as 'DESCUENTO',E.nombre as 'ESTADO', "+
"P.fecha as 'FECHA_PEDIDO' FROM DETALLES_PEDIDOS AS DP   "+
"INNER JOIN PEDIDOS AS P ON P.id_pedido = DP.id_pedido    "+
"INNER JOIN USUARIOS as U ON U.id_usuario = P.id_usuario    "+
"INNER JOIN PRODUCTOS as PR ON PR.id_producto = DP.id_producto    "+
"INNER JOIN ESTADOS as E ON p.id_estado = E.id_estado";


ventasRoutes.get('/getVentasEstado', verificarToken, async (req: any, res: Response) => { //Agregar el middleware del token cuando este hecho el login

    let estadoVenta = req.body.estado
    const datosToken = req.usuario

    if (datosToken.idRol == 1) {
        if (estadoVenta != '') {
            if (estadoVenta == 'TODAS') {
                let ventas = await query(queryOrders, []);

                res.json({
                    estado: "success",
                    mensaje: "Listado de VENTAS",
                    data: ventas
                })
            } else {
                let ventas = await query(queryOrders+" where E.nombre = ?", [estadoVenta]);

                res.json({
                    estado: "success",
                    mensaje: "Listado de VENTAS",
                    data: ventas
                })
            }

        } else {
            res.json({
                estado: "Error",
                mensaje: "Debe seleccionar un ESTADO",
            })
        }
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de administrador",
        })
    }
})
//BUSCAR VENTAS POR RANGO DE FECHAS
ventasRoutes.get('/getVentasFecha', verificarToken, async (req: any, res: Response) => { //Agregar el middleware del token cuando este hecho el login

    let fechaDesde = req.body.fechaDesde
    let fechaHasta = req.body.fechaHasta
    const datosToken = req.usuario

    if (datosToken.idRol == 1) {
        if (fechaDesde && fechaHasta != '') {
            let ventas = await query(queryOrders+" where p.fecha between  ? and ?", [fechaDesde, fechaHasta]);

            res.json({
                estado: "success",
                mensaje: "Listado de VENTAS",
                data: ventas
            })
        } else {
            res.json({
                estado: "Error",
                mensaje: "Debe seleccionar una fecha",
            })
        }
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de administrador",
        })
    }
})

//BUSCAR TODAS LAS VENTAS
ventasRoutes.get('/getAllVentas', verificarToken, async (req: any, res: Response) => {


    let ventas = await query(queryOrders, []);

    res.json({
        estado: "success",
        mensaje: "Se encontraron todos los registro de ventas",
        data: ventas
    })
})


export default ventasRoutes;
