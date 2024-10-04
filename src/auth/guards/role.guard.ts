import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserService, RoleService } from 'src/users/service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //saco mis datos de la request
    const req = context.switchToHttp().getRequest<Request>();
    //saco los datos del decorador de los permisos
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    //identifico al usuario y su rol
    const findUser = await this.userService.findUserId(req.userId);
    //pregunto si cada uno de los permisos lo tiene el rol que tiene el usuario
    for (let i = 0; i < permissions.length; i++) {
      await this.roleService.findRolePermission(
        findUser.roleId,
        permissions[i],
      );
    }
    return true;
  }
}
