import { Permission, Role, User } from '@prisma/client';

export interface IResponsePermission {
  total: number;
  permissions: Permission[];
}
export interface IResponseAllRoles {
  total: number;
  roles: Role[];
}
export interface IResponseAllUsers {
  total: number;
  users: User[];
}

export interface IResponseRole {
  role: Role;
}

export interface IResponseUser {
  user: User;
}
