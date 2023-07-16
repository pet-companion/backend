// OTP DTO

import {
  IsEmail,
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
  @IsEmail()
  email: string;
}

export class PasswordResetOtpDto extends VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SendOtpDto {
  @IsNotEmpty()
  @IsEmail()
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
