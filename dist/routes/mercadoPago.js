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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
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
    access_token: 'APP_USR-2950527085580-073003-cc208b447790e4820b5bb241fd7eab92-259070893'
});
//routes
mercadoPagoRoutes.post('/', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        .then(function (response) {
        console.log(response.body);
        res.redirect(response.body.init_point);
    }).catch(function (error) {
        console.log(error);
    });
}));
exports.default = mercadoPagoRoutes;
//server
// app.listen(3000, () => {
//     console.log("Server on port 3000");
// });
