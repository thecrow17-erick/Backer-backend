import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';

@Module({
  providers: [AuthService],
  imports: [forwardRef(() => UsersModule), JwtModule, ConfigModule],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
