import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UserService],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UsersModule {}
