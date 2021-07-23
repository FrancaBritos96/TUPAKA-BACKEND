"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    crearCarpetaUsuario(productId) {
        const pathProduct = path_1.default.resolve(__dirname, '../uploads', productId);
        const pathProducTemp = pathProduct + "/temp";
        console.log("ruta pathProduct", pathProduct);
        const existe = fs_1.default.existsSync(pathProduct);
        if (!existe) {
            fs_1.default.mkdirSync(pathProduct);
            fs_1.default.mkdirSync(pathProducTemp);
        }
        return pathProducTemp;
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    guardarImagenTemporal(ProductId, file) {
        return new Promise((resolve, reject) => {
            const path = this.crearCarpetaUsuario(ProductId);
            const nombreArchivo = this.generarNombreUnico(file.name);
            file.mv(`${path}/${nombreArchivo}`, (error) => {
                if (error) {
                    return reject(error);
                }
                else {
                    return resolve(true);
                }
            });
        });
    }
    obtenerImagenesTemp(productId) {
        const pathName = path_1.default.resolve(__dirname, '../uploads', productId, "temp");
        return fs_1.default.readdirSync(pathName); //[nombre_archivo1, nombre_archivo2..]
    }
    imagenesDeTempHaciaPost(productId) {
        const pathProductemp = path_1.default.resolve(__dirname, '../uploads', productId, "temp"); //De donde: origen
        const pathProductPost = path_1.default.resolve(__dirname, '../uploads', productId, "post"); //Hacia donde: destino
        if (!fs_1.default.existsSync(pathProductemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathProductPost)) {
            fs_1.default.mkdirSync(pathProductPost);
        }
        const imagenesTemp = this.obtenerImagenesTemp(productId);
        imagenesTemp.forEach(imagenes => {
            fs_1.default.renameSync(`${pathProductemp}/${imagenes}`, `${pathProductPost}/${imagenes}`);
        });
        return imagenesTemp;
    }
    getFotoUrl(productId, img) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', productId, "post", img);
        if (fs_1.default.existsSync(pathFoto)) {
            return pathFoto;
        }
        else {
            return path_1.default.resolve(__dirname, '../assets/default.png');
        }
    }
    getFotosUrls(productId) {
        var klaw = require('klaw');
        // an array to store the folder and files inside
        var items = [];
        var directoryToExplore = `./dist/uploads/${productId}/post`;
        klaw(directoryToExplore)
            .on('data', function (item) {
            items.push(item.path);
        })
            .on('end', function () {
            console.log(items);
        })
            .on('error', function (err, item) {
            console.log(err.message);
            console.log(item.path); // the file the error occurred on
        });
        return items;
    }
    createCarpetaUploads() {
        const pathUploads = path_1.default.resolve(__dirname, 'uploads');
        if (!fs_1.default.existsSync(pathUploads)) {
            fs_1.default.mkdirSync(pathUploads);
        }
    }
}
exports.default = FileSystem;
