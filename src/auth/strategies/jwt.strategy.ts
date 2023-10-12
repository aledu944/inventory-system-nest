import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";


import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        configService: ConfigService,
        
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
    ) {
        super({ 
            secretOrKey: configService.get('JWT_SECRET'), 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }


    async validate(payload: JwtPayload): Promise<User> {

        const { email } = payload;

        const user = await this.userRepository.findOneBy({ email });

        if( !user ){
            throw new UnauthorizedException('Token invalido');
        }



        return user;
    }

}