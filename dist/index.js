"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const connectionMySql_1 = __importDefault(require("./bin/connectionMySql"));
const body_parser_1 = __importDefault(require("body-parser"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
const sizes_1 = __importDefault(require("./routes/sizes"));
const orders_1 = __importDefault(require("./routes/orders"));
const orderDetails_1 = __importDefault(require("./routes/orderDetails"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const file_system_1 = __importDefault(require("./clases/file-system"));
const orderReports_1 = __importDefault(require("./routes/orderReports"));
const mercadoPago_1 = __importDefault(require("./routes/mercadoPago"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
server.start(() => {
    console.log('Servidor corriendo en puerto ' + server.puerto + '  y en host ' + server.host);
});
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
server.app.use(cors_1.default());
server.app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//Upload
const crearFolder = new file_system_1.default();
crearFolder.createCarpetaUploads();
server.app.use(express_fileupload_1.default());
//Rutas aplicación
server.app.use('/users', users_1.default);
server.app.use('/products', products_1.default);
server.app.use('/categories', categories_1.default);
server.app.use('/sizes', sizes_1.default);
server.app.use('/mercadoPago', mercadoPago_1.default);
server.app.use('/orders', orders_1.default);
server.app.use('/orderDetails', orderDetails_1.default);
server.app.use('/orderReports', orderReports_1.default);
//Ejemplo: localhost:3000/users/createUser
//Conexion a la base MySql
connectionMySql_1.default.connect((error) => {
    if (error) {
        throw error;
    }
    else {
        console.log('Aplicación conectada a base de datos MySql');
    }
});
