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
const token_1 = __importDefault(require("../clases/token"));
const authentication_1 = require("../middlewares/authentication");
const queryPromess_1 = __importDefault(require("./queryPromess"));
const usuario_1 = __importDefault(require("../controllers/usuario"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const connectionMySql_1 = __importDefault(require("../bin/connectionMySql"));
const userRoutes = express_1.Router();
//LOGIN
userRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let passwordHaash = yield bcrypt_1.default.hash(password, 8);
        if (email && password) {
            connectionMySql_1.default.query('SELECT * FROM usuarios where email = ?', [email], (error, results) => __awaiter(void 0, void 0, void 0, function* () {
                if (results.length == 0 || !(yield bcrypt_1.default.compare(password, results[0].password))) {
                    res.json({
                        estado: "success",
                        mensaje: "Usuario o Contraseña Incorrectos",
                    });
                }
                else {
                    const TokenJwt = token_1.default.getToken({
                        id: results[0].id_usuario,
                        nombre: results[0].nombre,
                        apellido: results[0].apellido,
                        dni: results[0].dni,
                        email: results[0].email,
                        idRol: results[0].id_rol,
                    });
                    res.json({
                        estado: "success",
                        mensaje: "¡LOGIN CORRECTO!",
                        data: results,
                        token: TokenJwt
                    });
                }
                res.end();
            }));
        }
        else {
            res.send('Please enter user and Password!');
            res.end();
        }
    }
    catch (error) {
        yield queryPromess_1.default("rollback", []);
        res.json({
            estado: "error",
            data: error
        });
    }
}));
//REGISTRAR
userRoutes.post('/createUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id_rol = 2;
        const id_estado = 1;
        const email = body.email;
        const password = body.password; //        bcrypt.hashSync(req.body.password, 10);
        const nombre = body.nombre;
        const apellido = body.apellido;
        const documento = body.numero_documento;
        const direccion = body.direccion;
        const telefono = body.telefono;
        const nacionalidad = body.nacionalidad;
        const provincia = body.provincia;
        const localidad = body.localidad;
        const cod_postal = body.cod_postal;
        let passEncriptado = yield bcrypt_1.default.hash(password, 8);
        let validarEmail = yield queryPromess_1.default(`Select * from usuarios where email = '${email}'`, []);
        if (validarEmail.length == 0) {
            let queryTransaction = "START TRANSACTION";
            let queryUsuario = "INSERT INTO USUARIOS (id_rol, id_estado, email, password, nombre, apellido, documento, direccion, telefono, nacionalidad, provincia, localidad, cod_postal)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
            yield queryPromess_1.default(queryTransaction, []);
            yield queryPromess_1.default(queryUsuario, [id_rol, id_estado, email, passEncriptado, nombre, apellido, documento, direccion, telefono, nacionalidad, provincia, localidad, cod_postal]);
            let commit = yield queryPromess_1.default("commit", []);
            res.json({
                estado: "Success",
                mensaje: "Usuario creado con exito",
                data: commit
            });
        }
        else {
            res.json({
                estado: "Error",
                mensaje: "El correo ingresado ya existe",
            });
        }
    }
    catch (error) {
        yield queryPromess_1.default("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo crear el usuario, intenta más tarde",
            data: error
        });
    }
}));
//CONSULTAR USUARIO POR DNI
userRoutes.get('/getUserByDni', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let documento = req.body.documento;
    let user = yield queryPromess_1.default("Select * from usuarios where documento = ?", [documento]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el usuario",
        data: user
    });
}));
//CONSULTAR USUARIO POR NOMBRE
userRoutes.get('/getUserByName', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userName = req.body.nombre;
    let user = yield queryPromess_1.default(`Select * from usuarios where name LIKE '%${userName}%'`, []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los usuarios",
        data: user
    });
}));
//CONSULTAR USUARIO POR ESTADO
userRoutes.get('/getUserByStatus', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userStatus = req.body.id_estado;
    let user = yield queryPromess_1.default(`Select * from usuarios where id_estado = ${userStatus}`, []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los usuarios",
        data: user
    });
}));
//CONSULTAR USUARIO LOGUEADO
userRoutes.get('/', authentication_1.verificarToken, usuario_1.default.token); // Sirve para obtener la info del usuario logueado
//CONSULTAR TODOS LOS USUARIOS
userRoutes.get('/getAllUsers', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield queryPromess_1.default("Select * from usuarios where id_estado = 1", []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los usuarios",
        data: users
    });
}));
exports.default = userRoutes;
