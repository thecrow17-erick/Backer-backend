import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from '../service/permission.service';
import { AuthTokenGuard, RoleGuard } from 'src/auth/guards';
import { Permission } from 'src/auth/decorators';
import { IApiResponse } from 'src/common/interface';
import {
  IResponseAllRoles,
  IResponsePermission,
  IResponseRole,
} from '../interface/response.interface';
import { QueryCommonDto } from 'src/common/dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleService } from '../service/role.service';

@UseGuards(AuthTokenGuard)
@Controller('role')
export class RoleController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}
  @Get('permissions')
  @HttpCode(HttpStatus.OK)
  public async getPermission(
    @Query() query: QueryCommonDto,
  ): Promise<IApiResponse<IResponsePermission>> {
    const statusCode = HttpStatus.OK;
    const [total, permissions] = await Promise.all([
      this.permissionService.countPermission({}),
      this.permissionService.findAllPermission({
        where: {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        skip: query.skip,
        take: query.limit,
      }),
    ]);
    return {
      statusCode,
      message: 'Find permission',
      data: {
        total,
        permissions,
      },
    };
  }
  @Get('get-role')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Permission('ver roles')
  public async getRoles(
    @Query() query: QueryCommonDto,
  ): Promise<IApiResponse<IResponseAllRoles>> {
    const statusCode = HttpStatus.OK;
    const [total, roles] = await Promise.all([
      this.roleService.countRole({
        where: {
          NOT: [
            {
              name: 'admin',
            },
          ],
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      }),
      this.roleService.findAllRole({
        where: {
          NOT: [
            {
              name: 'admin',
            },
          ],
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        skip: query.skip,
        take: query.limit,
      }),
    ]);
    return {
      statusCode,
      message: 'todos los roles',
      data: {
        total,
        roles,
      },
    };
  }

  @Post('create-role')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RoleGuard)
  @Permission('crear roles')
  public async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<IApiResponse<IResponseRole>> {
    const statusCode = HttpStatus.CREATED;
    const roleCreate = await this.roleService.createRole(createRoleDto);
    return {
      statusCode,
      message: 'rol creado',
      data: {
        role: roleCreate,
      },
    };
  }
  @Patch('update-role/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(RoleGuard)
  @Permission('editar roles')
  public async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<IApiResponse<IResponseRole>> {
    const statusCode = HttpStatus.ACCEPTED;
    const updateRole = await this.roleService.updateRole(id, createRoleDto);
    return {
      statusCode,
      message: 'rol actualizado',
      data: {
        role: updateRole,
      },
    };
  }
  @Delete('delete-role/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(RoleGuard)
  @Permission('eliminar roles')
  public async deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IApiResponse<IResponseRole>> {
    const statusCode = HttpStatus.ACCEPTED;
    const updateRole = await this.roleService.deleteRole(id);
    return {
      statusCode,
      message: 'rol eliminado',
      data: {
        role: updateRole,
      },
    };
  }
}
