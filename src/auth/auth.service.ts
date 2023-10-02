import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { LoginUserDto,CreateUserDto } from './dto';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>

  ){}

  async create(createUserDto: CreateUserDto) {
    const { password, ...newUserData } = createUserDto;
    try {
      const role = await this.roleRepository.findOneBy({ 
        id: createUserDto.roleId
      });

      const user = this.userRepository.create({
        ...newUserData,
        password: bcrypt.hashSync( password, 10 ),
      });

      user.role = role;
      

      await this.userRepository.save( user );

      return user;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto){
    const { email, password } = loginUserDto;
    
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: { email: true, password: true }
    });


    if( !user )
      throw new UnauthorizedException('Credenciales incorrectas')

    if( !await bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credenciales incorrectas')

    return user;
    
  }
  
  
  private handleExceptions(error: any){
    this.logger.error(error);

    if( error.code === '23505' ){
      throw new BadRequestException('El usuario ya existe')
    }
    
    throw new InternalServerErrorException('Internal Server Error')
  }
}
