import { Router, Request, Response } from 'express';
import Token from '../clases/token';
import { verificarToken } from '../middlewares/authentication'
import jwt from 'jsonwebtoken';
import query from './queryPromess';
import usuarios from '../controllers/usuario'
import bcrypt from 'bcrypt';
import connection from '../bin/connectionMySql';
import { Query } from 'mongoose';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


const mercadoPagoRoutes = Router();
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

//middleware

//app.use(bodyParser.urlencoded({ extended: false }))

// Agrega credenciales
mercadopago.configure({
    access_token: 'APP_USR-283574749098658-060723-1b829d5f4133650feec0904cb6c57a59-772004350'
  });

//routes
mercadoPagoRoutes.post('/mercadoPago', verificarToken, async (req: any, res: Response) => {

// Crea un objeto de preferencia

const datosToken = req.usuario
const idUser = req.para

const nombre = await query("SELECT PR.nombre as 'NOMBRE PRODUCTO' FROM DETALLES_PEDIDOS AS DP   "+
"INNER JOIN PEDIDOS AS P ON P.id_pedido = DP.id_pedido    "+
"INNER JOIN USUARIOS as U ON U.id_usuario = P.id_usuario    "+
"INNER JOIN PRODUCTOS as PR ON PR.id_producto = DP.id_producto    "+
"INNER JOIN ESTADOS as E ON p.id_estado = E.id_estado where u.id_usuario =?",[datosToken.id] )

console.log(nombre)

const precio = parseInt(req.body.precio);

const queryOrders = "SELECT U.nombre as 'NOMBRE CLIENTE', U.apellido as 'APELLIDO CLIENTE'," +
" U.documento as 'NRO_DOC', PR.nombre as 'NOMBRE PRODUCTO', DP.cantidad as 'CANTIDAD', DP.precio_unitario as 'PRECIO PRODUCTO',"+
" DP.precio_total as 'PRECIO TOTAL POR CANTIDAD', DP.descuento as 'DESCUENTO',E.nombre as 'ESTADO', "+
"P.fecha as 'FECHA PEDIDO' FROM DETALLES_PEDIDOS AS DP   "+
"INNER JOIN PEDIDOS AS P ON P.id_pedido = DP.id_pedido    "+
"INNER JOIN USUARIOS as U ON U.id_usuario = P.id_usuario    "+
"INNER JOIN PRODUCTOS as PR ON PR.id_producto = DP.id_producto    "+
"INNER JOIN ESTADOS as E ON p.id_estado = E.id_estado";

let preference = {
    items: [
      {
        title:nombre,
        unit_price: precio,
        quantity: 1,
      }
    ],
    
  };
  
  mercadopago.preferences.create(preference)
  .then(function(res:any){
    console.log(nombre)
    console.log(res.body)
    //res.redirect(res.body.init_point);
   
  }).catch(function(error:any){
    console.log(error);

  });
});

export default mercadoPagoRoutes;

//server

// app.listen(3000, () => {
//     console.log("Server on port 3000");
// });