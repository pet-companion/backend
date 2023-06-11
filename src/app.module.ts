import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailerModule } from '@nestjs-modules/mailer';

import { config } from 'dotenv';
import { Dialect } from 'sequelize';

import { Otp, User, Pet, PetCategory, Role, UserRoles } from './models';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { OtpModule } from './modules/otp/otp.module';
import { EmailModule } from './modules/email/email.module';
import { PetModule } from './modules/pet/pet.module';
import { S3Module } from './modules/s3/s3.module';
import { AdminModule } from './modules/admin/admin.module';

config();

const sequelizeConfig = {
  dialect: process.env.DB_DIALECT as Dialect,
  models: [User, Otp, Pet, PetCategory, UserRoles, Role],
  synchronize: true,
  uri: process.env.DATABASE_URL,
  define: {
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'createdAt'],
      },
    },
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({ ...sequelizeConfig }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        auth: {
          user: process.env.MAILER_USERNAME,
          pass: process.env.MAILER_PASSWORD,
        },
      },
    }),
    UserModule,
    AuthModule,
    OtpModule,
    EmailModule,
    PetModule,
    S3Module,
    AdminModule,
  ],
})
export class AppModule {}
