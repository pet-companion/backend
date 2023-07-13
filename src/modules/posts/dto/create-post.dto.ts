import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;

  @IsNumber()
  @IsNotEmpty()
  petCategoryId: number;
}
