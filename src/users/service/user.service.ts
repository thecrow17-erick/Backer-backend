import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { PrismaService } from 'src/prisma/service';
import { IOptionUserInterface } from '../interface';
import { CreateUserDto } from '../dto';
import { RoleService } from './role.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private roleService: RoleService,
  ) {}
  public generatorCode(length: number = 10): string {
    return randomBytes(length)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, length)
      .toUpperCase();
  }
  public async findUserId(id: string): Promise<User> {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        code: true,
        username: true,
        telephone: true,
        password: true,
        sexo: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        roleId: true,
        role: {
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
        },
      },
    });
    if (!findUser) throw new NotFoundException('usuario no encontrado');
    return findUser;
  }
  public async findAllUsers(option: IOptionUserInterface): Promise<User[]> {
    const findAll = await this.prismaService.user.findMany({
      where: option.where,
      take: option.take,
      skip: option.skip,
      cursor: option.cursor,
      orderBy: option.orderBy,
      select: option.select,
    });
    return findAll;
  }
  public async countUsers(option: IOptionUserInterface): Promise<number> {
    const findAll = await this.prismaService.user.count({
      where: option.where,
    });
    return findAll;
  }
  public async findUser({ where }: IOptionUserInterface): Promise<User | null> {
    const findUser = await this.prismaService.user.findFirst({
      where,
    });
    return findUser;
  }
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const findUser = await this.findUser({
      where: {
        telephone: createUserDto.telephone,
      },
    });
    if (findUser)
      throw new BadRequestException(
        'Cambien de nro de telefono, ya se encuentra ocupado',
      );
    const findRole = await this.roleService.findIdRole(createUserDto.roleId);
    const createUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        roleId: findRole.id,
        code: this.generatorCode(),
        password: this.hashPassword(createUserDto.telephone, 10),
      },
    });
    return createUser;
  }
  public hashPassword(password: string, salt: number): string {
    const saltHash = bcrypt.genSaltSync(salt);
    return bcrypt.hashSync(password, saltHash);
  }
  public async recoverPassword(id: string): Promise<User> {
    const findUser = await this.findUserId(id);

    const updateUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password: this.hashPassword(findUser.telephone, 10),
      },
    });
    return updateUser;
  }
  public async updateUser(
    id: string,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const findUser = await this.findUserId(id);
    const findRole = await this.roleService.findIdRole(createUserDto.roleId);
    const updateUser = await this.prismaService.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        code: this.generatorCode(),
        roleId: findRole.id,
        sexo: createUserDto.sexo,
        telephone: createUserDto.telephone,
        username: createUserDto.username,
      },
    });
    return updateUser;
  }
  public async deleteUser(id: string): Promise<User> {
    const findUser = await this.findUserId(id);
    const deleteUsr = await this.prismaService.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        status: !findUser.status,
      },
    });
    return deleteUsr;
  }
}
