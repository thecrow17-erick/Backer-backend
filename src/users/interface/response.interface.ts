import { Permission, Role, User } from '@prisma/client';

export interface IResponsePermission {
  total: number;
  permissions: Permission[];
}

export interface IResponseRole {
  role: Role;
}

export interface IResponseUser {
  user: User;
}
