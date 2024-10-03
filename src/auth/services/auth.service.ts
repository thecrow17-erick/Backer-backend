import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/service/user.service';
import {
  AuthTokenResult,
  ISignJwt,
  IUseToken,
} from '../interface/auth.interface';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public useToken(token: string): IUseToken | string {
    try {
      const decode = this.jwtService.decode(token) as AuthTokenResult;
      const currentDate = new Date();
      const expiresDate = new Date(decode.exp);

      return {
        userId: decode.userId,
        isExpired: +expiresDate <= +currentDate / 1000,
      };
    } catch (err) {
      console.log(err);
      return 'token es invalido';
    }
  }
  private signJwt({ expires, payload }: ISignJwt): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('secret_key_jwt'),
      expiresIn: expires,
    });
  }
}
