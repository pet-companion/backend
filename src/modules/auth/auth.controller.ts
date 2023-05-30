import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserInformation } from 'src/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { EmailVerificationGuard } from './guards/email-verification.guard';
import { PasswordResetOtpDto, VerifyEmailOtpDto } from '../otp/otp.dto';

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

  @UseGuards(new AccessTokenGuard())
  @Get('send-verification-code')
  async sendVerifyEmailOtp(@UserInformation() user: any) {
    return await this.authService.sendVerifyEmailOtp(user);
  }

  @UseGuards(new AccessTokenGuard())
  @Post('verify-email')
  async verifyEmail(
    @Body() { otp }: VerifyEmailOtpDto,
    @UserInformation() user: any,
  ) {
    return await this.authService.verifyEmail(otp, user);
  }

  @UseGuards(new AccessTokenGuard())
  @Get('send-reset-password-code')
  async sendPasswordResetOtp(@UserInformation() user: any) {
    return await this.authService.sendPasswordResetOtp(user);
  }

  @UseGuards(new AccessTokenGuard())
  @Post('reset-password')
  async resetPassword(
    @Body() { otp, newPassword }: PasswordResetOtpDto,
    @UserInformation() user: any,
  ) {
    return await this.authService.resetPassword({ otp, newPassword }, user);
  }

  @UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
  @Get('logout')
  async logout(@UserInformation() user: any) {
    return await this.authService.logout(user.id);
  }

  @UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
  @Get('me')
  me(@UserInformation() user: any) {
    return user;
  }

  @UseGuards(new RefreshTokenGuard(), new EmailVerificationGuard())
  @Get('refresh')
  async refresh(@UserInformation() user: any) {
    return await this.authService.refresh(user.id, user.refreshToken);
  }
}
