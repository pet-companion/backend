import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Otp } from 'src/models';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { SendOtpDto, VerifyOtpDto } from 'src/dtos/otp';
import { UserService } from '../user/user.service';

@Injectable()
export class OtpService {
  constructor(
    private emailService: EmailService,
    @InjectModel(Otp) private otpModel: typeof Otp,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async sendOtp(
    { email, subject, message, duration }: SendOtpDto,
    userId: number,
    returnMessage: string,
  ) {
    await this.deleteOtp(userId);

    const generatedOtp = this.generateOtp();

    await this.emailService.sendEmail({
      from: this.configService.get('MAILER_EMAIL'),
      to: email,
      subject: subject,
      html: `
        <h1>${message}</h1>
        <p style="font-size: 24px; font-weight: bold; color: #000000; text-align: center; margin: 0;"><b>${generatedOtp}</b></p>
        <p>This code <b>expires in ${duration} minute(s)</b>.</p>
      `,
      text: message,
    });

    const hashedOtp = await hash(generatedOtp, 10);

    await this.otpModel.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + duration * 60 * 1000),
      userId: userId,
    });

    return {
      message: returnMessage,
    };
  }

  async verifyOtp({ otp }: VerifyOtpDto, userEmail: string) {
    const user = await this.userService.findUserByEmail(userEmail);

    if (!user) {
      throw new BadRequestException('Email not found.');
    }

    const otpData = await this.otpModel.findOne({
      where: { userId: user.id },
    });

    if (!otpData) {
      throw new BadRequestException('OTP not found, request a new one.');
    }

    const { expiresAt } = otpData;

    if (expiresAt.getTime() < Date.now()) {
      await this.deleteOtp(user.id);
      throw new BadRequestException('OTP expired, request a new one.');
    }

    const isMatch = await compare(otp, otpData.otp);

    if (!isMatch) {
      throw new BadRequestException('Invalid code, please try again.');
    }

    await this.deleteOtp(user.id);

    return isMatch;
  }

  generateOtp() {
    return `${Math.floor(10000 + Math.random() * 90000)}`;
  }

  async deleteOtp(userId: number) {
    return this.otpModel.destroy({ where: { userId } });
  }
}
