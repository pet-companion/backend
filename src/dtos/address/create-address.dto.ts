import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsDecimal({ decimal_digits: '9,6' })
  @IsOptional()
  longitude?: number;

  @IsDecimal({ decimal_digits: '8,6' })
  @IsOptional()
  latitude?: number;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  streetAddress?: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  aptSuiteBldg?: string;
}
