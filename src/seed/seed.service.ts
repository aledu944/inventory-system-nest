import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { Role } from 'src/roles/entities/role.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {
  constructor(
    // private readonly userService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ){}

  async createData() {

    await this.deleteTables();
    
    const role = await this.insertRoles();
    await this.insertUsers( role );

    return "SEEDING DATA"
  }


  private async deleteTables() {
    const roleQueryBuilder = this.roleRepository.createQueryBuilder();
    const userQueryBuilder = this.userRepository.createQueryBuilder();


    await userQueryBuilder.delete().where({}).execute();
    await roleQueryBuilder.delete().where({}).execute();
  }

  private async insertUsers( role: Role ){
    const seedUsers = initialData.users;
  
    const insertPromises = []
    
    seedUsers.forEach( user => {
      user.role = role;
      insertPromises.push( this.userRepository.save( user ))
    })
  }

  
  private async insertRoles(){
    const seedRoles = initialData.roles;

    const roles: Role[] = [];

    seedRoles.forEach(role => {
      roles.push( this.roleRepository.create(role) );
    })

    const dbRoles = await this.roleRepository.save( seedRoles );
    return dbRoles[0];
  }


}
