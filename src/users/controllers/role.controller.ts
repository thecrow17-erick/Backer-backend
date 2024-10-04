import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from '../service/permission.service';
import { AuthTokenGuard, RoleGuard } from 'src/auth/guards';
import { Permission } from 'src/auth/decorators';
import { IApiResponse } from 'src/common/interface';
import {
  IResponsePermission,
  IResponseRole,
} from '../interface/response.interface';
import { QueryCommonDto } from 'src/common/dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleService } from '../service/role.service';

@UseGuards(AuthTokenGuard, RoleGuard)
@Controller('role')
export class RoleController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}
  @Get('create-role')
  @HttpCode(HttpStatus.OK)
  @Permission('crear roles')
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
  @Post('create-role')
  @HttpCode(HttpStatus.CREATED)
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
}
