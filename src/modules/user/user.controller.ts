import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from '../auth/guards';
import { Roles, UserInformation } from 'src/decorators';
import { RoleEnum } from 'src/enums';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';

@Controller('user')
@Roles(RoleEnum.USER)
@UseGuards(AccessTokenGuard, EmailVerificationGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  async updateUser(
    @Body() { name, phoneNumber, email }: UpdateUserDto,
    @UserInformation() user: any,
  ) {
    return this.userService.updateUser(user.id, { name, phoneNumber, email });
  }

  @Delete()
  async deleteUser(@UserInformation() user: any) {
    return this.userService.updateUser(user.id, { isDeleted: true });
  }
}
