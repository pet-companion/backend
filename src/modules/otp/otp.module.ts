import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { Otp, Role, User, UserRoles } from 'src/models';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [SequelizeModule.forFeature([Otp, User, Role, UserRoles])],
  controllers: [OtpController],
  providers: [OtpService, EmailService, UserService],
})
export class OtpModule {}
