import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator.ts.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

   constructor(
    private readonly reflector: Reflector
   ){}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles:string[] = this.reflector.get(META_ROLES, ctx.getHandler())

    if(!validRoles) return true
    if(validRoles.length === 0 ) return true

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;

    if(!user){
      throw new InternalServerErrorException('User not found (guard)')
    }

    for (const role of user.roles){
      if(validRoles.includes(role)){
        return true
      }
    }

    throw new ForbiddenException(`User ${user.fullName} need a valid role: [${validRoles}]` )
  }
}
