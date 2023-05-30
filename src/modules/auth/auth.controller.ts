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
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @UseGuards(new AccessTokenGuard())
  @Get('send-verification-code')
  async sendVerifyEmailOtp(@UserInformation() user: any) {
    return this.authService.sendVerifyEmailOtp(user);
  }

  @UseGuards(new AccessTokenGuard())
  @Post('verify-email')
  async verifyEmail(
    @Body() { otp }: VerifyEmailOtpDto,
    @UserInformation() user: any,
  ) {
    return this.authService.verifyEmail(otp, user);
  }

  @UseGuards(new AccessTokenGuard())
  @Get('send-reset-password-code')
  async sendPasswordResetOtp(@UserInformation() user: any) {
    return this.authService.sendPasswordResetOtp(user);
  }

  @UseGuards(new AccessTokenGuard())
  @Post('reset-password')
  async resetPassword(
    @Body() { otp, newPassword }: PasswordResetOtpDto,
    @UserInformation() user: any,
  ) {
    return this.authService.resetPassword({ otp, newPassword }, user);
  }

  @UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
  @Get('logout')
  logout(@UserInformation() user: any) {
    return this.authService.logout(user.id);
  }

  @UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
  @Get('me')
  me(@UserInformation() user: any) {
    return user;
  }

  @UseGuards(new RefreshTokenGuard(), new EmailVerificationGuard())
  @Get('refresh')
  refresh(@UserInformation() user: any) {
    return this.authService.refresh(user.id, user.refreshToken);
  }
}
