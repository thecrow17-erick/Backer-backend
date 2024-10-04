import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto';
import { IApiResponse } from 'src/common/interface';
import { IResponseAuth } from '../interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async loginController(
    @Body() loginDto: LoginDto,
  ): Promise<IApiResponse<IResponseAuth>> {
    const statusCode = HttpStatus.OK;
    const authLogin = await this.authService.login(loginDto);
    return {
      statusCode,
      message: 'Login OK',
      data: authLogin,
    };
  }
}
