import { Category } from '@prisma/client';

export interface IResponseCategory {
  category: Category;
}

export interface IResponseAllCategory {
  total: number;
  categories: Category[];
}
