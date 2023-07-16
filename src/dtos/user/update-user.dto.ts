import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { RoleEnum } from 'src/enums';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
}
