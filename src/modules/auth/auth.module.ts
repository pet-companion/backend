import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from 'src/models';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

config();

@Module({
  imports: [SequelizeModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
