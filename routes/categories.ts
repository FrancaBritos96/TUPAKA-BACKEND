import { Router, Request, Response } from 'express';
import Token from '../clases/token';
import { verificarToken } from '../middlewares/authentication'
import jwt from 'jsonwebtoken';
import query from './queryPromess';
import usuarios from '../controllers/usuario'
import bcrypt from 'bcrypt';
import connection from '../bin/connectionMySql';
import { Query } from 'mongoose';

const categoriesRoutes = Router();

//CARGAR CATEGORIAS Administrador

categoriesRoutes.post('/createCat', verificarToken, async (req: any, res: Response) => {

    const id_estado = '1';
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const datosToken = req.usuario;

    let queryCategoria = "INSERT INTO CATEGORIAS (id_estado, nombre, descripcion)  VALUES(?,?,?)";

    if (datosToken.idRol == '1') {
        if (nombre && descripcion != '') {

            await query(queryCategoria, [id_estado, nombre, descripcion]);

            let commit = await query("commit", []);

            res.json({
                estado: "Success",
                mensaje: "Categoria creada con Exito!",
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
categoriesRoutes.put('/editCat/:id', verificarToken, async (req: any, res: Response) => {


    const datosToken = req.usuario;
    const { id } = req.params;

    const { nombre, descripcion } = req.body;
    const newCategorie = {
        nombre,
        descripcion
    };

    if (datosToken.idRol == '1') {
        if (nombre && descripcion != '') {

            await query('SELECT * FROM CATEGORIAS WHERE id_categoria = ?', [id]);
            await query("UPDATE categorias set ? WHERE id_categoria = ?", [newCategorie, id]);
            let commit = await query("commit", []);

            res.json({
                estado: "success",
                mensaje: "Categoria editada con exito",
                data: commit
            })
        } else {
            res.json({
                estado: "success",
                mensaje: "Debe completar todos los campos para poder editar una categoria",
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

categoriesRoutes.put('/deleteCat/:id', verificarToken, async (req: any, res: Response) => {

    const datosToken = req.usuario;
    const { id } = req.params;

    if (datosToken.idRol == '1') {

        const categoria = await query('SELECT * FROM CATEGORIAS WHERE id_categoria = ?', [id]);
        await query("UPDATE categorias set id_estado='2' WHERE id_categoria = ?", [id]);
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

//BUSCAR CATEGORIAS POR ID
categoriesRoutes.get('/getCategoryById/:id', verificarToken, async (req: any, res: Response) => { //Agregar el middleware del token cuando este hecho el login

    const { id } = req.params;
    const datosToken = req.usuario

    if (datosToken.idRol == 1) {
        let category = await query("Select * from categorias where id_categoria = ?", [id]);
        res.json({
            estado: "success",
            mensaje: "Se encontró la categoria",
            data: category
        })
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de Administrador"
        })
    }
})

//BUSCAR TODAS LAS CATEGORIAS
categoriesRoutes.get('/getAllCategories', verificarToken, async (req: any, res: Response) => {

    let categories = await query("Select * from categorias where id_estado = 1", []);
    res.json({
        estado: "success",
        mensaje: "Se encontraron todas las categorias",
        data: categories
    })
})

//BUSCAR CATEGORIAS POR NOMBRE
categoriesRoutes.get('/getCategoryName', verificarToken, async (req: any, res: Response) => { //Agregar el middleware del token cuando este hecho el login

    let categoryName = req.body.nombre
    const datosToken = req.usuario

    if (datosToken.idRol == 1) {
        let category = await query("Select * from categorias where nombre like ?", ['%'+categoryName+'%']);
        res.json({
            estado: "success",
            mensaje: "Se encontró la categoria",
            data: category
        })
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tenes permisos de Administrador"
        })
    }
})

export default categoriesRoutes;