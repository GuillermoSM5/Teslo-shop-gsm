import { Controller, Post, Body, Get, UseGuards, Req, Headers, SetMetadata} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator.ts.decorator';
import { ValidRoles } from './interface/valid-roles';
import { Auth } from './decorators/auth.decorator';

// import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @RawHeaders() rawHeader: string[],
    @Headers() headers: IncomingHttpHeaders,
  ){
    return {
      ok: true,
      message:'Hola mundo private',
      user,
      userEmail,
      rawHeader,
      headers
    }
  }



  @Get('private2')
  // @SetMetadata('roles',['admin','super-user'])
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){
     return {
      ok: true,
      user
     }
  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  privateRoute3(
    @GetUser() user: User
  ){
     return {
      ok: true,
      saludos:'hola',
      user
     }
  }
}
