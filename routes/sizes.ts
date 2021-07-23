import { Router, Request, Response } from 'express';
import Token from '../clases/token';
import { verificarToken } from '../middlewares/authentication'
import jwt from 'jsonwebtoken';
import query from './queryPromess';
import usuarios from '../controllers/usuario'
import bcrypt from 'bcrypt';
import connection from '../bin/connectionMySql';
import { Query } from 'mongoose';

const sizesRoutes = Router();

//CARGAR CATEGORIAS Administrador

sizesRoutes.post('/createSizes', verificarToken, async (req: any, res: Response) => {

    const id_estado = '1';
    const nombre = req.body.nombre;
    const ancho = req.body.ancho;
    const profundidad = req.body.profundidad;
    const alto = req.body.alto;
    const datosToken = req.usuario;

    let querySizes = "INSERT INTO TAMAÑOS (id_estado, nombre, ancho, profundidad, alto)  VALUES(?,?,?,?,?)";

    if (datosToken.idRol == '1') {
        if (nombre && ancho && profundidad && alto != '') {

            await query(querySizes, [id_estado, nombre, ancho, profundidad, alto]);

            let commit = await query("commit", []);

            res.json({
                estado: "Success",
                mensaje: "Nuevo tamaño creado con Exito!",
                data: commit
            })
        } else {
            res.json({
                estado: "Success",
                mensaje: "Debe completar todos los campos para continuar",
            })
        }
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        })
    }
})

//EDITAR CATEGORIAS
sizesRoutes.put('/editSizes/:id', verificarToken, async (req: any, res: Response) => {


    const datosToken = req.usuario
    const { id } = req.params;

    const { nombre, ancho, profundidad, alto, } = req.body;
    const newSizes = {
        nombre,
        ancho,
        profundidad,
        alto
    };

    if (datosToken.idRol == '1') {
        if (nombre && ancho && profundidad && alto != '') {

            const sizes = await query('SELECT * FROM TAMAÑOS WHERE id_tamaño = ?', [id]);
            await query("UPDATE TAMAÑOS set ? WHERE id_tamaño = ?", [newSizes, id]);
            let commit = await query("commit", []);

            res.json({
                estado: "success",
                mensaje: "Tamaño editado con exito",
                data: commit
            })
        } else {
            res.json({
                estado: "success",
                mensaje: "Debe completar todos los campos para poder editar un tamaño",
            })
        }
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        })
    }
})

//EDITAR/ELIMINAR CATEGORIAS

sizesRoutes.put('/deleteSizes/:id', verificarToken, async (req: any, res: Response) => {

    const datosToken = req.usuario
    const { id } = req.params;

    if (datosToken.idRol == '1') {

        const sizes = await query('SELECT * FROM TAMAÑOS WHERE id_tamaño = ?', [id]);
        await query("UPDATE TAMAÑOS set id_estado='2' WHERE id_tamaño = ?", [id]);
        let commit = await query("commit", []);

        res.json({
            estado: "success",
            mensaje: "Categoria eliminada con exito",
            data: commit
        })

    } else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        })
    }
})

//BUSCAR TAMAÑO POR ID
sizesRoutes.get('/getSizeById/:id', async (req: any, res: Response) => { //Agregar el middleware del token cuando este hecho el login

    const { id } = req.params;
    const datosToken = req.usuario

    // if (datosToken.idRol == 1) {
    let size = await query("Select * from tamaños where id_tamano = ?", [id]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el tamaño",
        data: size
    })
    // } else {
    // res.json({
    //     estado: "Error",
    //    mensaje: "No tenes permisos de Administrador"
    // })
    // }
})
//BUSCAR TAMAÑO POR NOMBRE
sizesRoutes.get('/getSizeName', verificarToken, async (req: any, res: Response) => { //Agregar el middleware del token cuando este hecho el login

    let sizeName = req.body.nombre
    const datosToken = req.usuario

    if (datosToken.idRol == 1) {
        let size = await query("Select * from tamaños where nombre like ?", ['%' + sizeName + '%']);
        res.json({
            estado: "success",
            mensaje: "Se encontró el tamaño",
            data: size
        })
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de Administrador"
        })
    }
})

//BUSCAR TODAS LOS TAMAÑOS
sizesRoutes.get('/getAllSizes', verificarToken, async (req: any, res: Response) => {

    let sizes = await query("Select * from tamaños where id_estado = 1", []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron todos los tamaños",
        data: sizes
    })
})


export default sizesRoutes;