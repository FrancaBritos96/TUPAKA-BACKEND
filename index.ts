import Server from './clases/server';
import connection from './bin/connectionMySql';
import bodyParser from 'body-parser';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import categoriesRoutes from './routes/categories';
import sizesRoutes from './routes/sizes';
import orderRoutes from './routes/orders';
import orderDetailRoutes from './routes/orderDetails';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import FileSystem from './clases/file-system';
import ventasRoutes from './routes/orderReports';
import mercadoPagoRoutes from './routes/mercadoPago';
import cors from 'cors';

const server = new Server();

server.start(() => {
    console.log('Servidor corriendo en puerto ' + server.puerto + '  y en host ' + server.host);
});

//Body parser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());
server.app.use(cors());


//Upload
const crearFolder = new FileSystem();
crearFolder.createCarpetaUploads();
server.app.use(fileUpload());


//Rutas aplicación

server.app.use('/users', userRoutes);
server.app.use('/products', productRoutes);
server.app.use('/categories', categoriesRoutes);
server.app.use('/sizes', sizesRoutes);
server.app.use('/mercadoPago', mercadoPagoRoutes);
server.app.use('/orders', orderRoutes);
server.app.use('/orderDetails', orderDetailRoutes);
server.app.use('/orderReports', ventasRoutes);




//Ejemplo: localhost:3000/users/createUser



//Conexion a la base MySql
connection.connect((error) => {
    if (error) {
        throw error
    }
    else {
        console.log('Aplicación conectada a base de datos MySql')
    }
});
