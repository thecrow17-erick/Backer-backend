import { $Enums } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  username: string;

  @IsEnum($Enums.Sexo, { message: 'El sexo debe ser M o F' })
  sexo: $Enums.Sexo;

  @IsPhoneNumber('BO')
  telephone: string;

  @IsNumber()
  roleId: number;
}
