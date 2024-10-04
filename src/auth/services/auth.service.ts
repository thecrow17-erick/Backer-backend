import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/service';
import * as bcrypt from 'bcrypt';
import {
  AuthTokenResult,
  IResponseAuth,
  ISignJwt,
  IUseToken,
} from '../interface';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async login(loginDto: LoginDto): Promise<IResponseAuth> {
    const findUser = await this.userService.findUser({
      where: {
        username: loginDto.username,
      },
    });
    if (!findUser) throw new NotFoundException('Usuario no encontrado');
    const validatePassword = bcrypt.compareSync(
      loginDto.password,
      findUser.password,
    );
    if (!validatePassword)
      throw new BadRequestException('Password incorrecto, intente de nuevo');
    const signInJwt = this.signJwt({
      expires: 10 * 24 * 60 * 60,
      payload: {
        userId: findUser.id,
      },
    });
    return {
      token: signInJwt,
      user: findUser,
    };
  }
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
