import { User } from '@prisma/client';

export interface IResponseAuth {
  user: User;
  token: string;
}
