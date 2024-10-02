import { Prisma } from '@prisma/client';

export interface IOptionUserInterface {
  skip?: number;
  take?: number;
  where?: Prisma.UserWhereInput;
  select?: Prisma.UserSelect;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  cursor?: Prisma.UserWhereUniqueInput;
  distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
  include?: Prisma.UserInclude;
}
