import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthTokenGuard, RoleGuard } from 'src/auth/guards';
import { UserService } from '../service';
import { Permission } from 'src/auth/decorators';
import { CreateUserDto } from '../dto';
import { IApiResponse } from 'src/common/interface';
import { IResponseUser } from '../interface/response.interface';

@UseGuards(AuthTokenGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
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
}
