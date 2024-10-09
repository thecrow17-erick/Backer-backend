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
import { CategoryService } from '../services';
import { AuthTokenGuard, RoleGuard } from 'src/auth/guards';
import { Permission } from 'src/auth/decorators';
import { IApiResponse } from 'src/common/interface';
import { IResponseAllCategory, IResponseCategory } from '../interface';
import { QueryCommonDto } from 'src/common/dto';
import { CreateCategoryDto } from '../dto';

@Controller('category')
@UseGuards(AuthTokenGuard, RoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('get-category')
  @HttpCode(HttpStatus.OK)
  @Permission('ver categorias')
  public async getCategories(
    @Query() query: QueryCommonDto,
  ): Promise<IApiResponse<IResponseAllCategory>> {
    const statusCode = HttpStatus.OK;
    const [total, categories] = await Promise.all([
      this.categoryService.countCategory({
        where: {
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
      this.categoryService.findAllCategory({
        where: {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        take: query.limit,
        skip: query.skip,
      }),
    ]);
    return {
      statusCode,
      message: 'todas las categorias',
      data: {
        total,
        categories,
      },
    };
  }
  @Get('get-category/:id')
  @HttpCode(HttpStatus.OK)
  @Permission('ver categorias')
  public async getCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IApiResponse<IResponseCategory>> {
    const statusCode = HttpStatus.OK;
    const findCategory = await this.categoryService.findCategoryId(id);
    return {
      statusCode,
      message: 'busqueda de categoria',
      data: {
        category: findCategory,
      },
    };
  }
  @Post('create-category')
  @HttpCode(HttpStatus.CREATED)
  @Permission('crear categorias')
  public async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<IApiResponse<IResponseCategory>> {
    const statusCode = HttpStatus.CREATED;
    const categoryCreate =
      await this.categoryService.createCategory(createCategoryDto);
    return {
      statusCode,
      message: 'categoria creada',
      data: {
        category: categoryCreate,
      },
    };
  }
  @Patch('edit-category/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @Permission('editar categorias')
  public async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<IApiResponse<IResponseCategory>> {
    const statusCode = HttpStatus.ACCEPTED;
    const categoryCreate = await this.categoryService.updateCategory(
      id,
      createCategoryDto,
    );
    return {
      statusCode,
      message: 'categoria editada',
      data: {
        category: categoryCreate,
      },
    };
  }
  @Delete('delete-category/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @Permission('eliminar categorias')
  public async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IApiResponse<IResponseCategory>> {
    const statusCode = HttpStatus.ACCEPTED;
    const categoryCreate = await this.categoryService.deleteCategory(id);
    return {
      statusCode,
      message: 'categoria eliminada',
      data: {
        category: categoryCreate,
      },
    };
  }
}
