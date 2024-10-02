import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/service';
import { IOptionUserInterface } from '../interface/option-user.interface';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  public generatorCode(length: number = 10): string {
    return randomBytes(length)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, length);
  }
  public async findUserId(id: string): Promise<User> {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!findUser) throw new NotFoundException('user not found');
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

  // public async findUser({}: IOptionUserInterface)
}
