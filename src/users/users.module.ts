import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleService } from './service/role.service';
import { PermissionService } from './service/permission.service';
import { RoleController } from './controllers/role.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './controllers/user.controller';

@Module({
  providers: [UserService, RoleService, PermissionService],
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  exports: [UserService, RoleService],
  controllers: [RoleController, UserController],
})
export class UsersModule {}
