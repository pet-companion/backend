import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { Dialect } from 'sequelize';

config();

const sequelizeConfig = {
  dialect: process.env.DB_DIALECT as Dialect,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_DEVELOPMENT,
  models: [],
  synchronize: true,
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
    SequelizeModule.forRoot(sequelizeConfig),
  ],
})
export class AppModule {}
