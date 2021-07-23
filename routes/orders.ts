import { Router, Request, Response } from 'express';
import { verificarToken } from '../middlewares/authentication'
import query from './queryPromess';

const orderRoutes = Router();


//OBTENER PEDIDO POR ID

orderRoutes.get('/getOrderById', verificarToken, async (req: any, res: Response) => { 

    let orderId = req.body.id_pedido

    let order = await query("Select * from pedidos where id_pedido = ?", [orderId]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el pedido",
        data: order
    })
})


//OBTENER PEDIDO POR ESTADO

orderRoutes.get('/getOrderByStatus', verificarToken, async (req: any, res: Response) => { 

    let orderStatusId = req.body.id_estado

    let orders = await query("Select * from pedidos where id_estado = ?", [orderStatusId]);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los pedidos",
        data: orders
    })
})


//OBTENER PEDIDOS POR USUARIO

orderRoutes.get('/getOrderByUser', verificarToken, async (req: any, res: Response) => { 
    const datosToken = req.usuario;
    const userId  = datosToken.id;

    let orders = await query("Select * from pedidos where id_usuario = ?", [userId]);
    res.json({
        estado: "success",
        mensaje: "Se encontraron los pedidos para el usuario",
        data: orders
    })
})

//OBTENER TODOS LOS PEDIDOS Administrador

orderRoutes.get('/getAllOrders', verificarToken, async (req: any, res: Response) => {
    const datosToken = req.usuario;
    if (datosToken.idRol == '1') {
        let orders = await query("Select * from pedidos where id_estado = 1", []);
        res.json({
            estado: "success",
            mensaje: "Se encontraron los pedidos",
            data: orders
        })    
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        })
    }
})


//CARGAR PEDIDO

orderRoutes.post('/createOrder', verificarToken, async (req: any, res: Response) => {
    try {
        const datosToken = req.usuario;

        const id_usuario = datosToken.id;
        const id_estado = '1';
        const fecha: Date = new Date();

        let queryTransaction = "START TRANSACTION"
        let queryOrder = "INSERT INTO PEDIDOS (id_usuario, id_estado, fecha)  VALUES(?,?,?)";

        await query(queryTransaction, []);
        let insertOrder: any = await query(queryOrder, [id_usuario, id_estado, fecha]);

        await query("commit", []);
        res.json({
            estado: "Success",
            mensaje: "Pedido creado con exito",
            data: insertOrder
        })
    }
    catch (error) {
        await query("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo crear el pedido",
            data: error
        });
    }
})


//EDITAR ESTADO DEL PEDIDO

orderRoutes.put('/editOrderStatus/:id', verificarToken, async (req: any, res: Response) => {

    const datosToken = req.usuario;
    const { id } = req.params;

    const id_estado = req.body.id_estado;

    if (datosToken.idRol == '1') {

        await query(`UPDATE pedidos set id_estado= ${id_estado} WHERE id_pedido = ${id}`, []);
        let commit = await query("commit", []);

        res.json({
            estado: "success",
            mensaje: "Pedido editado con exito",
            data: commit
        })

    } else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        })
    }
})



export default orderRoutes;