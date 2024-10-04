import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/service';
import { IOptionPermissionInterface } from '../interface';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}
  public async findAllPermission(
    option: IOptionPermissionInterface,
  ): Promise<Permission[]> {
    const findAll = await this.prismaService.permission.findMany({
      where: option.where,
      take: option.take,
      skip: option.skip,
      select: option.select,
      orderBy: option.orderBy,
      cursor: option.cursor,
    });
    return findAll;
  }
  public async countPermission(
    option: IOptionPermissionInterface,
  ): Promise<number> {
    const findAll = await this.prismaService.permission.count({
      where: option.where,
    });
    return findAll;
  }
}
