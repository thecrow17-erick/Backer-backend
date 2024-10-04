import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleService } from './service/role.service';

@Module({
  providers: [UserService, RoleService],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UsersModule {}
