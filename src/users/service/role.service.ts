import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, Role_Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/service';
import { IOptionRoleInterface } from '../interface';
import { CreateRoleDto } from '../dto/create-role.dto';
import { PermissionService } from './permission.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionService: PermissionService,
  ) {}
  public async findRolePermission(
    roleId: number,
    permission: string,
  ): Promise<Role_Permission | void> {
    const findPermission = await this.prismaService.permission.findFirst({
      where: {
        name: permission,
      },
    });
    if (!findPermission) throw new BadRequestException('Permiso no existe');
    const findRole = await this.prismaService.role_Permission.findFirst({
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
        'El usuario no tiene este permiso autorizado',
      );
    return findRole;
  }
  public async findAllRole(option: IOptionRoleInterface): Promise<Role[]> {
    const findAll = await this.prismaService.role.findMany({
      where: option.where,
      take: option.take,
      skip: option.skip,
      select: option.select,
      orderBy: option.orderBy,
      cursor: option.cursor,
    });
    return findAll;
  }
  public async countRole(option: IOptionRoleInterface): Promise<number> {
    const findAll = await this.prismaService.role.count({
      where: option.where,
    });
    return findAll;
  }
  public async findIdRole(id: number): Promise<Role> {
    const findRole = await this.prismaService.role.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
    if (!findRole) throw new NotFoundException('rol no encontrado');
    return findRole;
  }
  public async findRole({ where }: IOptionRoleInterface): Promise<Role> {
    const findRole = await this.prismaService.role.findFirst({ where });
    return findRole;
  }
  public async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const findPermissions = await this.permissionService.findAllPermission({
      where: {
        OR: createRoleDto.permissions.map(p => ({
          id: p,
        })),
      },
    });
    if (findPermissions.length !== createRoleDto.permissions.length)
      throw new BadRequestException('Ingrese permisos validos');
    const findRole = await this.findRole({
      where: {
        name: createRoleDto.name,
      },
    });
    if (findRole)
      throw new BadRequestException(
        'el nombre para el rol ya se encuentra en uso',
      );
    const createRole = await this.prismaService.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        permissions: {
          createMany: {
            data: createRoleDto.permissions.map(p => ({
              permissionId: p,
            })),
          },
        },
      },
    });
    return createRole;
  }
  public async updateRole(
    id: number,
    createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    const findRole = await this.findIdRole(id);
    const findPermissions = await this.permissionService.findAllPermission({
      where: {
        OR: createRoleDto.permissions.map(p => ({
          id: p,
        })),
      },
    });
    if (findPermissions.length !== createRoleDto.permissions.length)
      throw new BadRequestException('Ingrese permisos validos');
    await this.prismaService.role_Permission.deleteMany({
      where: {
        roleId: findRole.id,
      },
    });
    const updateRole = await this.prismaService.role.update({
      where: {
        id: findRole.id,
      },
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        permissions: {
          createMany: {
            data: createRoleDto.permissions.map(p => ({
              permissionId: p,
            })),
          },
        },
      },
    });
    return updateRole;
  }
  public async deleteRole(id: number): Promise<Role> {
    const findRole = await this.findIdRole(id);
    const deleteRole = await this.prismaService.role.update({
      where: {
        id: findRole.id,
      },
      data: {
        status: !findRole.status,
      },
    });
    return deleteRole;
  }
}
