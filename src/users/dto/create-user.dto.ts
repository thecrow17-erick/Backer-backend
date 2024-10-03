import { $Enums } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  username: string;

  @IsEnum($Enums.Sexo, { message: 'El sexo debe ser M o F' })
  sexo: $Enums.Sexo;

  @IsString()
  @MaxLength(255)
  password: string;

  @IsPhoneNumber('BO')
  telephono: string;

  @IsNumber()
  roleId: number;
}
