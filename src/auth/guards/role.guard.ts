import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService, RoleService } from 'src/users/service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    const findUser = await this.userService.findUserId(req.userId);
    if (!findUser) throw new NotFoundException('usuario no encontrado');
    for (const permission in permissions) {
      const findPermission = await this.roleService.findRolePermission(
        findUser.roleId,
        permission,
      );
      console.log(findPermission);
    }
    return true;
  }
}
