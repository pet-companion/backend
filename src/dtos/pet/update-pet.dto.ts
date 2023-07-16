import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdatePetDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  breed: string;

  @IsBoolean()
  @IsOptional()
  isNeuter: boolean;

  @IsDateString()
  @IsOptional()
  dateOfBirth: Date;
}
