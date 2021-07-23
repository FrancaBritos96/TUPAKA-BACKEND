"use strict";
module.exports = {
    token: (req, res) => {
        const usuario = req.usuario;
        res.json({
            estado: "succes",
            mensaje: "Usuario logueado",
            data: usuario
        });
    }
};
