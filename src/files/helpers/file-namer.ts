import { Request } from "express";

export const fileNamer = (req: Request, file: Express.Multer.File, callback: Function ) => {

    if( !file ) return callback( new Error("File is empty"), false );
    
    const originalName = file.originalname;
    const fileName= `${ originalName }`; 


    callback(null, fileName);
}