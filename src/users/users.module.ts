import { forwardRef, Module } from '@nestjs/common';
import { UserService, RoleService, PermissionService } from './service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleController, UserController } from './controllers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UserService, RoleService, PermissionService],
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  exports: [UserService, RoleService],
  controllers: [RoleController, UserController],
})
export class UsersModule {}
