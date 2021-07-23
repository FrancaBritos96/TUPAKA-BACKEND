import {Router, Request, Response} from 'express';

export = {
    token: (req:any, res:Response)=>{
        const usuario = req.usuario;

        res.json({
            estado: "succes",
            mensaje: "Usuario logueado",
            data: usuario
        })
      
    }
}