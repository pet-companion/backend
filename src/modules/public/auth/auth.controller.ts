import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserInformation } from 'src/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../../../dtos/auth/auth.dto';
import { EmailVerificationGuard } from './guards/email-verification.guard';
import { PasswordResetOtpDto, VerifyEmailOtpDto } from 'src/dtos/otp';
import { EmailDto } from 'src/dtos/email';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Public - Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @UseGuards(AccessTokenGuard)
  @Get('send-verification-code')
  async sendVerifyEmailOtp(@Body() { email }: EmailDto) {
    return await this.authService.sendVerifyEmailOtp(email);
  }

  @UseGuards(AccessTokenGuard)
  @Post('verify-email')
  async verifyEmail(@Body() { otp, email }: VerifyEmailOtpDto) {
    return await this.authService.verifyEmail(otp, email);
  }

  @UseGuards(AccessTokenGuard, EmailVerificationGuard)
  @Get('send-reset-password-code')
  async sendPasswordResetOtp(@Body() { email }: EmailDto) {
    return await this.authService.sendPasswordResetOtp(email);
  }

  @UseGuards(AccessTokenGuard, EmailVerificationGuard)
  @Post('reset-password')
  async resetPassword(
    @Body() { otp, newPassword, email }: PasswordResetOtpDto,
  ) {
    return await this.authService.resetPassword({ otp, newPassword }, email);
  }

  @UseGuards(AccessTokenGuard, EmailVerificationGuard)
  @Get('logout')
  async logout(@UserInformation() user: any) {
    return await this.authService.logout(user.id);
  }

  @UseGuards(AccessTokenGuard, EmailVerificationGuard)
  @Get('me')
  me(@UserInformation() user: any) {
    return user;
  }

  @UseGuards(RefreshTokenGuard, EmailVerificationGuard)
  @Get('refresh')
  async refresh(@UserInformation() user: any) {
    return await this.authService.refresh(user.id, user.refreshToken);
  }
}
