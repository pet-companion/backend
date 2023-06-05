import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';

import { Otp, Role, User, UserRoles } from 'src/models';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { OtpService } from '../otp/otp.service';
import { EmailService } from '../email/email.service';

config();

@Module({
  imports: [
    SequelizeModule.forFeature([User, Otp, UserRoles, Role]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UserService,
    OtpService,
    EmailService,
  ],
})
export class AuthModule {}
