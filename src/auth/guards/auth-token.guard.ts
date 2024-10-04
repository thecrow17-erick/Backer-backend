import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from 'src/users/service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //saco el token del header
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers['auth-token'];
    //pregunto si lo saque o si es un arreglo
    if (!token || Array.isArray(token))
      throw new UnauthorizedException('No hay token');
    //pregunto si es un token valido
    const payload = this.authService.useToken(token);
    if (typeof payload === 'string') throw new UnauthorizedException(payload);
    //pregunto si el token sigue siendo valido
    if (payload.isExpired) throw new UnauthorizedException('token expirado');
    //busco si el usuario sigue existiendo
    const findUser = await this.userService.findUserId(payload.userId);
    req.userId = findUser.id;
    return true;
  }
}
