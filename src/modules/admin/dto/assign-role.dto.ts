import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from 'src/enums';

export class AssignRoleDto {
  @IsNotEmpty()
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[] = [RoleEnum.USER];
}
