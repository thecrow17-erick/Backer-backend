import { Prisma } from '@prisma/client';

export interface IOptionRoleInterface {
  skip?: number;
  take?: number;
  where?: Prisma.RoleWhereInput;
  select?: Prisma.RoleSelect;
  orderBy?: Prisma.RoleOrderByWithRelationInput;
  cursor?: Prisma.RoleWhereUniqueInput;
  distinct?: Prisma.RoleScalarFieldEnum | Prisma.RoleScalarFieldEnum[];
  include?: Prisma.RoleInclude;
}
