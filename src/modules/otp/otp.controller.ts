import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { AccessTokenGuard } from '../auth/guards';
import { UserInformation } from 'src/decorators';
import { UserService } from '../user/user.service';
import { VerifyOtpDto } from './otp.dto';

@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private userService: UserService,
  ) {}

  @UseGuards(new AccessTokenGuard())
  @Get('')
  async sendVerifyEmailOtp(@UserInformation() user: any) {
    const userEmail = (await this.userService.findUserById(user.id)).email;

    return await this.otpService.sendOtp(
      {
        email: userEmail,
        message: 'Your verification code is',
        subject: 'Verify your email',
        duration: 2,
      },
      user.id,
    );
  }

  @UseGuards(new AccessTokenGuard())
  @Post('verify')
  async verifyEmail(
    @Body() { otp }: VerifyOtpDto,
    @UserInformation() user: any,
  ) {
    if (user.isVerified) {
      throw new BadRequestException('User is already verified.');
    }
    const isMatch = await this.otpService.verifyOtp({ otp }, user.id);

    const updatedUser = await this.userService.updateEmailVerificationStatus(
      user.id,
      isMatch,
    );

    return {
      message: 'Email verified successfully.',
      user: updatedUser,
    };
  }
}
