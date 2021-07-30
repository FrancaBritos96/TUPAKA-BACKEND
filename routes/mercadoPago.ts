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
    access_token: 'APP_USR-2950527085580-073003-cc208b447790e4820b5bb241fd7eab92-259070893'
  });

//routes
mercadoPagoRoutes.post('/', verificarToken, async (req: any, res: Response) => {

// Crea un objeto de preferencia

const precio = parseInt(req.body.precio);


let preference = {
    items: [
      {
        title:"Productos Tupaka seleccionados",
        unit_price: precio,
        quantity: 1,
      }
    ],
    
  };
  
  mercadopago.preferences.create(preference)
  .then(function(response:any){
      console.log(response.body)
    res.redirect(response.body.init_point);
   
  }).catch(function(error:any){
    console.log(error);

  });
});

export default mercadoPagoRoutes;

//server

// app.listen(3000, () => {
//     console.log("Server on port 3000");
// });