import { Router, Request, Response } from 'express';
import Token from '../clases/token';
import { verificarToken } from '../middlewares/authentication'
import jwt from 'jsonwebtoken';
import query from './queryPromess';
import usuarios from '../controllers/usuario'
import bcrypt from 'bcrypt';
import connection from '../bin/connectionMySql';

const userRoutes = Router();

//LOGIN
userRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        let passwordHaash = await bcrypt.hash(password, 8);

        if (email && password) {

            connection.query('SELECT * FROM usuarios where email = ?', [email], async (error, results) => {
                if (results.length == 0 || !(await bcrypt.compare(password, results[0].password))) {

                    res.json({
                        estado: "success",
                        mensaje: "Usuario o Contraseña Incorrectos",

                    })

                } else {

                    const TokenJwt = Token.getToken({
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


                    })

                }
                res.end();
            });

        } else {

            res.send('Please enter user and Password!');
            res.end();
        }

    } catch (error) {
        await query("rollback", []);
        res.json({
            estado: "error",
            data: error
        });
    }
});

//REGISTRAR
userRoutes.post('/createUser', async (req: any, res: Response) => {
    try {
        const body = req.body;
        const id_rol = 2;
        const id_estado = 1;
        const email = body.email;
        const password = body.password //        bcrypt.hashSync(req.body.password, 10);
        const nombre = body.nombre;
        const apellido = body.apellido;
        const documento = body.numero_documento;
        const direccion = body.direccion;
        const telefono = body.telefono;
        const nacionalidad = body.nacionalidad;
        const provincia = body.provincia;
        const localidad = body.localidad;
        const cod_postal = body.cod_postal;

        let passEncriptado = await bcrypt.hash(password, 8)

        let validarEmail: any = await query(`Select * from usuarios where email = '${email}'`, []);
       
        if (validarEmail.length == 0) {

            let queryTransaction = "START TRANSACTION"
            let queryUsuario = "INSERT INTO USUARIOS (id_rol, id_estado, email, password, nombre, apellido, documento, direccion, telefono, nacionalidad, provincia, localidad, cod_postal)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";

            await query(queryTransaction, []);

            await query(queryUsuario, [id_rol, id_estado, email, passEncriptado, nombre, apellido, documento, direccion, telefono, nacionalidad, provincia, localidad, cod_postal]);

            let commit = await query("commit", []);
            res.json({
                estado: "Success",
                mensaje: "Usuario creado con exito",
                data: commit
            })
        } else {
            res.json({
                estado: "Error",
                mensaje: "El correo ingresado ya existe",
            })
        }
    }

    catch (error) {
        await query("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo crear el usuario, intenta más tarde",
            data: error
        });
    }


})

//CONSULTAR USUARIO POR DNI
userRoutes.get('/getUserByDni', verificarToken, async (req: any, res: Response) => {

    let documento = req.body.documento

    let user = await query("Select * from usuarios where documento = ?", [documento]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el usuario",
        data: user
    })
})

//CONSULTAR USUARIO POR NOMBRE
userRoutes.get('/getUserByName', verificarToken, async (req: any, res: Response) => {

    let userName = req.body.nombre

    let user = await query(`Select * from usuarios where name LIKE '%${userName}%'`, []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los usuarios",
        data: user
    })
})

//CONSULTAR USUARIO POR ESTADO
userRoutes.get('/getUserByStatus', verificarToken, async (req: any, res: Response) => {

    let userStatus = req.body.id_estado

    let user = await query(`Select * from usuarios where id_estado = ${userStatus}`, []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los usuarios",
        data: user
    })
})

//CONSULTAR USUARIO LOGUEADO
userRoutes.get('/', verificarToken, usuarios.token); // Sirve para obtener la info del usuario logueado

//CONSULTAR TODOS LOS USUARIOS
userRoutes.get('/getAllUsers', verificarToken, async (req: any, res: Response) => {

    let users = await query("Select * from usuarios where id_estado = 1", []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los usuarios",
        data: users
    })
})

export default userRoutes;