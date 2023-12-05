import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from "bcrypt";
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly jwtService: JwtService

  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...newUserData } = createUserDto;
    try {
      const role = await this.roleRepository.findOneBy({
        id: createUserDto.roleId
      });

      const user = this.userRepository.create({
        ...newUserData,
        password: bcrypt.hashSync(password, 10),
      });

      user.role = role;


      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createClient(createClientDto: CreateClientDto) {
    const { password, ...newUserData } = createClientDto;
    try {
      const role = await this.roleRepository.findOneBy({
        name: 'user'
      });

      console.log(role)

      const user = this.userRepository.create({
        ...newUserData,
        password: bcrypt.hashSync(password, 10),
      });

      user.role = role;


      await this.userRepository.save(user);

      const { id, name, lastname, email } = user;


      return {
        user: {
          id,
          name,
          lastname,
          email,
          role: role.name
        },
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, id: true, password: true, name: true, lastname: true },
      relations: {
        role: true,
      }
    });


    if (!user)
      throw new UnauthorizedException('Credenciales incorrectas')

    if (!await bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales incorrectas')


    const { id, role, name, lastname } = user;

    return {
      user: {
        id,
        name,
        lastname,
        email,
        role: role.name
      },
      token: this.getJwtToken({ id: user.id })
    };
  }


  async checkAuth(user: User) {

    const { id, email, role, name, lastname } = user;

    return {
      user: {
        id,
        name,
        lastname,
        email,
        role: role.name
      },
      token: this.getJwtToken({ id: user.id })
    };

  }

  async getClients(){
    const clients = this.userRepository.find({
      where: {
        role: {
          name: 'user',
        }
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        gender: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return clients;
  }


  async findMany(){

    const users = this.userRepository.find({
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
      relations: ['role'],
      order: {
        createdAt: 'DESC'
      }
    });
    return users
  }

  
  private getJwtToken( payload: JwtPayload ){
    const token = this.jwtService.sign( payload );
    return token;
  }


  private handleExceptions(error: any) {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new BadRequestException('El usuario ya existe')
    }

    throw new InternalServerErrorException('Internal Server Error')
  }
}
