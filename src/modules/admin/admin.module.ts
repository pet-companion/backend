import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserService } from '../user/user.service';
import { Role, User, UserRoles } from 'src/models';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRoles])],
  providers: [AdminService, UserService],
  controllers: [AdminController],
})
export class AdminModule {}
