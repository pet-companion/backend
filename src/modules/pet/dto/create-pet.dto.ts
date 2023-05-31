import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { GenderEnum } from 'src/enums';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: string;

  @IsBoolean()
  @IsNotEmpty()
  isNeuter: boolean;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNumber()
  @IsNotEmpty()
  petCategoryId: number;
}
