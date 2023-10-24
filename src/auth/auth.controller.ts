import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { ValidRoles } from './enums/meta-roles';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserRoleGuard } from './guards/user-role.guard';
import { Auth, GetUser, RoleProtected } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User
  ) {


    console.log(user)

    return {
      ok: true,
      user
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  private2(
    @GetUser() user: User
  ){
    return {
      ok: 'true 2',
      user
    }
  }


  @Get('private3')
  @Auth(ValidRoles.employee)
  private3(
    @GetUser() user: User
  ){
    return {
      ok: 'true 2',
      user
    }
  }

}
