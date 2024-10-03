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

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
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
    });
    if (!findUser) throw new NotFoundException(' user not found ');
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
  public async findUser({ where }: IOptionUserInterface): Promise<User | null> {
    const findUser = await this.prismaService.user.findFirst({
      where,
    });
    return findUser;
  }
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const findUser = this.findUser({
      where: {
        telephono: createUserDto.telephono,
      },
    });
    if (findUser)
      throw new BadRequestException(
        `Cambien de nro de telefono, 
        ya se encuentra ocupado`,
      );
    const createUser = this.prismaService.user.create({
      data: {
        ...createUserDto,
        code: this.generatorCode(),
        password: this.hashPassword(createUserDto.password, 10),
      },
    });
    return createUser;
  }
  public hashPassword(password: string, salt: number): string {
    const saltHash = bcrypt.genSaltSync(salt);
    return bcrypt.hashSync(password, saltHash);
  }
}
