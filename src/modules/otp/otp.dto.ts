// OTP DTO

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 5)
  otp: string;
}

export class VerifyEmailOtpDto extends VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class PasswordResetOtpDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  duration: number;
}
