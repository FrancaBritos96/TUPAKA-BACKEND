import { Router, Request, Response } from 'express';
import { verificarToken } from '../middlewares/authentication'
import query from './queryPromess';

const orderDetailRoutes = Router();


//OBTENER DETALLE DE PEDIDO POR ID

orderDetailRoutes.get('/getOrderDetailById', verificarToken, async (req: any, res: Response) => {

    let orderDetailId = req.body.id_detalle_pedido

    let orderDetail = await query("Select * from detalles_pedidos where id_detalle_pedido = ?", [orderDetailId]);
    res.json({
        estado: "success",
        mensaje: "Se encontró el detalle de pedido",
        data: orderDetail
    })
})

//OBTENER DETALLE DE PEDIDO POR ID DE PEDIDO

orderDetailRoutes.get('/getOrderDetailByOrderId', verificarToken, async (req: any, res: Response) => {

    let orderId = req.body.id_pedido

    let orderDetails = await query("Select * from detalles_pedidos where id_pedido = ?", [orderId]);
    res.json({
        estado: "success",
        mensaje: "Se encontró los detalles de pedido por id_pedido",
        data: orderDetails
    })
})


//OBTENER TODOS LOS DETALLES DE PEDIDO Administrador

orderDetailRoutes.get('/getAllOrderDetails', verificarToken, async (req: any, res: Response) => {
    const datosToken = req.usuario;
    if (datosToken.idRol == '1') {
        let orderDetails = await query("Select * from detalles_pedidos where id_estado = 1", []);
        res.json({
            estado: "success",
            mensaje: "Se encontraron detalles de pedido",
            data: orderDetails
        })
    } else {
        res.json({
            estado: "Error",
            mensaje: "No tienes permisos de Administrador",
        })
    }
})


//CARGAR DETALLE DE PEDIDO

orderDetailRoutes.post('/createOrderDetail', verificarToken, async (req: any, res: Response) => {
    try {

        const body = req.body;
        const id_pedido = body.id_pedido;
        const id_producto = body.id_producto;
        const id_estado = '1';
        const cantidad = body.cantidad;
        const descuento = '0';


        let queryTransaction = "START TRANSACTION";
        let queryProduct = "SELECT * FROM PRODUCTOS WHERE ID_PRODUCTO = ?";
        let queryOrderDetail = "INSERT INTO DETALLES_PEDIDOS (ID_PEDIDO, ID_PRODUCTO, ID_ESTADO, CANTIDAD, PRECIO_UNITARIO, PRECIO_TOTAL, DESCUENTO)  VALUES(?,?,?,?,?,?,?)";
        

        await query(queryTransaction, []);
        let product: any = await query(queryProduct, [id_producto]);
        const newProductStock = product[0].stock - cantidad;
        let queryNewProductStock = `UPDATE PRODUCTOS set STOCK = ${newProductStock} WHERE ID_PRODUCTO = ?`;

        if (cantidad <= product[0].stock && cantidad > 0) {
            const precio_unitario = product[0].precio;
            const precioTotal = cantidad * precio_unitario;

            let insertOrderDetail: any = await query(queryOrderDetail, [id_pedido, id_producto, id_estado, cantidad, precio_unitario, precioTotal, descuento]);
            await query(queryNewProductStock, [id_producto]);

            await query("commit", []);
            res.json({
                estado: "Success",
                mensaje: "Detalle de pedido creado con exito",
                data: insertOrderDetail
            })
        }
        else {
            res.json({
                estado: "error",
                mensaje: "No hay stock suficiente de este producto",
                data: id_producto
            });
        }

    }
    catch (error) {
        await query("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo crear el detalle de pedido",
            data: error
        });
    }
})


//EDITAR DETALLE DE PEDIDO

orderDetailRoutes.put('/editOrderDetailCantidad', verificarToken, async (req: any, res: Response) => {
    try {
        const datosToken = req.usuario;
        if (datosToken.idRol == '1') {
            let { id_detalle_pedido, id_pedido, id_producto, id_estado, cantidad, precio_unitario, precioTotal, descuento } = req.body;

            let queryTransaction = "START TRANSACTION";
            await query(queryTransaction, []);

            let queryOrdeDetail = "SELECT * FROM DETALLES_PEDIDOS WHERE ID_DETALLE_PEDIDO = ?";
            let orderDetail: any = await query(queryOrdeDetail, [id_detalle_pedido]);

            if (orderDetail[0].cantidad != cantidad) {
                precioTotal = precio_unitario * cantidad;
            }

            if (orderDetail[0].id_estado != id_estado) {
                let queryOrderDetails = "SELECT * FROM DETALLES_PEDIDOS WHERE ID_PEDIDO = ?";
                let orderDetails: any = await query(queryOrderDetails, [id_pedido]);
                let existActiveOrderDetail: boolean = false;

                for (let i = 0; i < orderDetails.length; i++) {
                    if (orderDetails[i].id_estado == '1' && !existActiveOrderDetail && orderDetails[i].id_detalle_pedido != id_detalle_pedido) {
                        existActiveOrderDetail = true;
                    }
                }

                if (!existActiveOrderDetail) {
                   // let queryOrder = "SELECT * FROM PEDIDOS WHERE ID_PEDIDO = ?";
                   // let order: any = await query(queryOrder, [id_pedido]);

                    await query("UPDATE PEDIDOS set ID_ESTADO = '2' WHERE id_PEDIDO = ?", [id_pedido]);
                }
            }

            const newOrderDetail = {
                id_pedido,
                id_producto,
                id_estado,
                cantidad,
                precio_unitario,
                precioTotal,
                descuento
            };

            let updatedOrderDetail = await query("UPDATE detalles_pedidos set ? WHERE id_detalle_pedido = ?", [newOrderDetail, id_detalle_pedido]);
            await query("commit", []);

            res.json({
                estado: "success",
                mensaje: "Detalle de pedido editado con exito",
                data: updatedOrderDetail
            })

        } else {
            res.json({
                estado: "Error",
                mensaje: "No tienes permisos de Administrador",
            })
        }
    }
    catch (error) {
        await query("rollback", []);
        res.json({
            estado: "error",
            mensaje: "No se pudo modificar el detalle de pedido",
            data: error
        });
    }
})

export default orderDetailRoutes;