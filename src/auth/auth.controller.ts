import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './enums/meta-roles';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('register')
  @Auth(ValidRoles.admin)
  createUser(
    @Body() createUserDto: CreateUserDto,
    roleId: string,
  ) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('check-auth')
  @Auth()
  checkAuth(
    @GetUser() user: User
  ){
    return this.authService.checkAuth(user);
  }

}