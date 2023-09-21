import { Response } from 'express';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';

import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file-namer';
import { fileFilter } from './helpers/file-filter';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get(':image')
  findImage(
    @Res() res: Response,
    @Param('image') image: string
  ){
    const path = this.filesService.getStaticImage(image);
    res.sendFile( path )
  }

  @Post('uploads')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }) )
  uploadProductFile(
    @UploadedFile() file: Express.Multer.File
  ){
    if( !file ) {
      throw new BadRequestException('Make sure that the file is an image file')
    } 

    const secureUrl = `${ this.configService.get('HOST_API') }/files/${ file.filename }`
    return secureUrl;  
  }

}
