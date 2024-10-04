import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role_Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/service';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}
  public async findRolePermission(
    roleId: number,
    permission: string,
  ): Promise<Role_Permission> {
    const findPermission = await this.prismaService.permission.findFirst({
      where: {
        name: permission,
      },
    });
    if (!findPermission) throw new BadRequestException('Permiso no existe');
    const findRole = this.prismaService.role_Permission.findFirst({
      where: {
        AND: [
          {
            roleId,
          },
          {
            permissionId: findPermission.id,
          },
        ],
      },
    });
    if (!findRole)
      throw new UnauthorizedException(
        'El rol no tiene este permiso autorizado',
      );
    return findRole;
  }
}
