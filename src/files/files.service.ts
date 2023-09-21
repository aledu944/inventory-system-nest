import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
    getStaticImage( image: string ){
        const path = join(__dirname, '../../static/uploads', image)
        if( !existsSync(path) ){
            throw new BadRequestException('No such file');
        }

        return path
    }
}
