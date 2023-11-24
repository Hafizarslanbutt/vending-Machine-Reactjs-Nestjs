import { IsEmail, IsEnum, IsIn, IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { role } from '../users.enum';

export const ALLOWED_PRICES = [5, 10, 20, 50, 100];
export class CreateUserDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsIn(ALLOWED_PRICES, {
    message: 'Deposit value must be 5, 10, 20, 50, or 100.',
  })
  deposit: number;

  @IsEnum(role)
  role: role;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {}
