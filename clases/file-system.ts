import path from 'path';
import fs from 'fs';
import uniqId from 'uniqid';
import { IfileUpload } from '../interfaces/file-upload';

export default class FileSystem {
    constructor() { }

    private crearCarpetaUsuario(productId: string): string {
        const pathProduct = path.resolve(__dirname, '../uploads', productId);
        const pathProducTemp = pathProduct + "/temp";
        console.log("ruta pathProduct", pathProduct);

        const existe: boolean = fs.existsSync(pathProduct);

        if (!existe) {
            fs.mkdirSync(pathProduct);
            fs.mkdirSync(pathProducTemp);
        }

        return pathProducTemp;

    }

    private generarNombreUnico(nombreOriginal: string): string {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqId();

        return `${idUnico}.${extension}`;

    }

    guardarImagenTemporal(ProductId: string, file: IfileUpload): Promise<any> {
        return new Promise((resolve, reject) => {
            const path: string = this.crearCarpetaUsuario(ProductId);
            const nombreArchivo: string = this.generarNombreUnico(file.name);

            file.mv(`${path}/${nombreArchivo}`, (error: any) => {
                if (error) {
                    return reject(error);
                }
                else {
                    return resolve(true);
                }
            })
        })


    }

    private obtenerImagenesTemp(productId: string): Array<string> {
        const pathName = path.resolve(__dirname, '../uploads', productId, "temp");
        return fs.readdirSync(pathName); //[nombre_archivo1, nombre_archivo2..]
    }

    imagenesDeTempHaciaPost(productId: string): Array<string> {
        const pathProductemp = path.resolve(__dirname, '../uploads', productId, "temp"); //De donde: origen
        const pathProductPost = path.resolve(__dirname, '../uploads', productId, "post"); //Hacia donde: destino

        if (!fs.existsSync(pathProductemp)) {
            return [];
        }

        if (!fs.existsSync(pathProductPost)) {
            fs.mkdirSync(pathProductPost);
        }

        const imagenesTemp: Array<string> = this.obtenerImagenesTemp(productId);
        imagenesTemp.forEach(imagenes => {
            fs.renameSync(`${pathProductemp}/${imagenes}`, `${pathProductPost}/${imagenes}`)
        })

        return imagenesTemp
    }

    getFotoUrl(productId: string, img: string) {
        const pathFoto: string = path.resolve(__dirname, '../uploads', productId, "post", img);

        if (fs.existsSync(pathFoto)) {
            return pathFoto;
        }
        else {
            return path.resolve(__dirname, '../assets/default.png')
        }

    }

    getFotosUrls(productId: string): any[] {
        var klaw = require('klaw');

        // an array to store the folder and files inside
        var items: any[] = [];

        var directoryToExplore = `./dist/uploads/${productId}/post`;

        klaw(directoryToExplore)
            .on('data', function (item: { path: any; }) {
                items.push(item.path)
            })
            .on('end', function () {
                console.log(items);
            })
            .on('error', function (err: { message: any; }, item: { path: any; }) {
                console.log(err.message)
                console.log(item.path) // the file the error occurred on
            });
            return items;
    }

    createCarpetaUploads(): void {
        const pathUploads = path.resolve(__dirname, 'uploads');

        if (!fs.existsSync(pathUploads)) {
            fs.mkdirSync(pathUploads);
        }
    }
}