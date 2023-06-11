import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role, User, UserRoles } from 'src/models';
import { UserController } from './user.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRoles])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
