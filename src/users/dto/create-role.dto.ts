import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(255)
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  permissions: Array<number>;
}
