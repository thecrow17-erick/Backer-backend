import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthTokenGuard, RoleGuard } from 'src/auth/guards';
import { RoleService, UserService } from '../service';
import { Permission } from 'src/auth/decorators';
import { CreateUserDto } from '../dto';
import { IApiResponse } from 'src/common/interface';
import {
  IResponseAllRoles,
  IResponseAllUsers,
  IResponseUser,
} from '../interface/response.interface';
import { QueryCommonDto } from 'src/common/dto';
import { Request } from 'express';

@UseGuards(AuthTokenGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Get('get-roles')
  @HttpCode(HttpStatus.OK)
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

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RoleGuard)
  @Permission('crear usuarios')
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponse<IResponseUser>> {
    const statusCode = HttpStatus.CREATED;
    const userCreate = await this.userService.createUser(createUserDto);
    return {
      statusCode,
      message: 'Usuario creado',
      data: {
        user: userCreate,
      },
    };
  }
  @Patch('recover-password/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(RoleGuard)
  @Permission('recuperar password')
  public async recoverPassword(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IApiResponse<IResponseUser>> {
    const statusCode = HttpStatus.ACCEPTED;
    const updateUser = await this.userService.recoverPassword(id);
    return {
      statusCode,
      message: 'password recuperado',
      data: {
        user: updateUser,
      },
    };
  }
  @Get('get-user/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Permission('ver usuarios')
  public async findUserId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IApiResponse<IResponseUser>> {
    const statusCode = HttpStatus.OK;
    const findUser = await this.userService.findUserId(id);
    return {
      statusCode,
      message: 'busqueda de usuario',
      data: {
        user: findUser,
      },
    };
  }
  @Get('get-user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Permission('ver usuarios')
  public async getUsers(
    @Query() queryCommonDto: QueryCommonDto,
    @Req() req: Request,
  ): Promise<IApiResponse<IResponseAllUsers>> {
    const statusCode = HttpStatus.OK;
    const userId = req.userId;
    const [total, allUsers] = await Promise.all([
      this.userService.countUsers({
        where: {
          AND: [
            {
              username: {
                contains: queryCommonDto.search,
                mode: 'insensitive',
              },
            },
            {
              NOT: [
                {
                  role: {
                    name: 'admin',
                  },
                },
                {
                  id: userId,
                },
              ],
            },
          ],
        },
      }),
      this.userService.findAllUsers({
        where: {
          AND: [
            {
              username: {
                contains: queryCommonDto.search,
                mode: 'insensitive',
              },
            },
            {
              NOT: [
                {
                  role: {
                    name: 'admin',
                  },
                },
                {
                  id: userId,
                },
              ],
            },
          ],
        },
        skip: queryCommonDto.skip,
        take: queryCommonDto.limit,
      }),
    ]);
    return {
      statusCode,
      message: 'todos los usuarios',
      data: {
        total,
        users: allUsers,
      },
    };
  }
  @Patch('update-user/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(RoleGuard)
  @Permission('editar usuarios')
  public async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponse<IResponseUser>> {
    const statusCode = HttpStatus.ACCEPTED;
    const updateUser = await this.userService.updateUser(id, createUserDto);
    return {
      statusCode,
      message: 'usuario actualizado',
      data: {
        user: updateUser,
      },
    };
  }
  @Delete('delete-user/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(RoleGuard)
  @Permission('eliminar usuarios')
  public async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IApiResponse<IResponseUser>> {
    const statusCode = HttpStatus.ACCEPTED;
    const deleteUsR = await this.userService.deleteUser(id);
    return {
      statusCode,
      message: 'usuario eliminado',
      data: {
        user: deleteUsR,
      },
    };
  }
}
