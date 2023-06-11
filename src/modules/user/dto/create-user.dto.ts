import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from 'src/enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[] = [RoleEnum.USER];
}
