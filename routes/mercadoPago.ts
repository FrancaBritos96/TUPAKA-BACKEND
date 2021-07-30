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
const mercadopago = require('mercadopago');

//middleware


// Agrega credenciales
mercadopago.configure({
  access_token: 'APP_USR-6623451607855904-111502-1f258ab308efb0fb26345a2912a3cfa5-672708410'
});

//USUARIO DE PRUEBA MERCADO PAGO
//"id": 772004350,
// "nickname": "TETE7159651",
//  "password": "qatest4286",
//  "site_status": "active",
// "email": "test_user_20926595@testuser.com"

//routes
mercadoPagoRoutes.post('/', verificarToken, async (req: any, res: Response) => {

  // Crea un objeto de preferencia

  const precio = parseInt(req.body.precio);


  let preference = {
    items: [
      {
        title: "Productos Tupaka seleccionados",
        unit_price: precio,
        quantity: 1,
      }
    ],

  };

  mercadopago.preferences.create(preference)
    .then(function (response: any) {
      console.log(response.body)
      // res.redirect(response.body.init_point);
      res.json({
        estado: "success",
        mensaje: "Link de pago creado",
        data: response.body.init_point
      });

    }).catch(function (error: any) {
      console.log(error);

    });
});

export default mercadoPagoRoutes;

//server

// app.listen(3000, () => {
//     console.log("Server on port 3000");
// });