import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { Category } from '@prisma/client';
import { IOptionCategoryInterface } from '../interface';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}
  public async findAllCategory(
    option: IOptionCategoryInterface,
  ): Promise<Category[]> {
    const findCategories = await this.prismaService.category.findMany({
      where: option.where,
      skip: option.skip,
      take: option.take,
      select: option.select,
      orderBy: option.orderBy,
      cursor: option.cursor,
      distinct: option.distinct,
    });
    return findCategories;
  }
  public async countCategory(
    option: IOptionCategoryInterface,
  ): Promise<number> {
    const findCategories = await this.prismaService.category.count({
      where: option.where,
    });
    return findCategories;
  }
  public async findCategory(
    option: IOptionCategoryInterface,
  ): Promise<Category> {
    const findCategory = await this.prismaService.category.findFirst({
      where: option.where,
    });
    return findCategory;
  }
  public async findCategoryId(id: number): Promise<Category> {
    const findCategory = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });
    if (!findCategory) throw new NotFoundException('categoria no encontrada');
    return findCategory;
  }
  public async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const findCategory = await this.findCategory({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (findCategory) throw new BadRequestException('la categoria ya existe');
    const createCategory = await this.prismaService.category.create({
      data: {
        ...createCategoryDto,
      },
    });
    return createCategory;
  }
  public async updateCategory(
    id: number,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const findCategory = await this.findCategory({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (findCategory) throw new BadRequestException('la categoria ya existe');
    const findIdCategory = await this.findCategoryId(id);
    const updateCategory = await this.prismaService.category.update({
      where: {
        id: findIdCategory.id,
      },
      data: {
        ...createCategoryDto,
      },
    });
    return updateCategory;
  }
  public async deleteCategory(id: number): Promise<Category> {
    const findIdCategory = await this.findCategoryId(id);
    const deleteCat = await this.prismaService.category.update({
      where: {
        id: findIdCategory.id,
      },
      data: {
        status: !findIdCategory.status,
      },
    });
    return deleteCat;
  }
}
