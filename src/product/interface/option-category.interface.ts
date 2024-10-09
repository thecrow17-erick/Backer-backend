import { Prisma } from '@prisma/client';

export interface IOptionCategoryInterface {
  skip?: number;
  take?: number;
  where?: Prisma.CategoryWhereInput;
  select?: Prisma.CategorySelect;
  orderBy?: Prisma.CategoryOrderByWithRelationInput;
  cursor?: Prisma.CategoryWhereUniqueInput;
  distinct?: Prisma.CategoryScalarFieldEnum | Prisma.CategoryScalarFieldEnum[];
  include?: Prisma.CategoryInclude;
}
