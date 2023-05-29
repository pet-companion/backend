import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { Otp, User } from 'src/models';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Otp]),
    SequelizeModule.forFeature([User]),
    EmailModule,
    UserModule,
  ],
  controllers: [OtpController],
  providers: [OtpService, EmailService, UserService],
})
export class OtpModule {}