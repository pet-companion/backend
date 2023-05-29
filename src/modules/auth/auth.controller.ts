import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserInformation } from 'src/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { EmailVerificationGuard } from './guards/email-verification.guard';

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
