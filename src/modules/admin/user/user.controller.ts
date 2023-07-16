import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from '../../public/auth/guards';
import { RoleEnum } from 'src/enums';
import { EndpointURL, Roles } from 'src/decorators';
import { UserService } from 'src/modules/public/user/user.service';

import { AssignRoleDto, CreateUserDto, UpdateUserDto } from '../user/dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryParamsDto, SearchDto } from 'src/dtos/user';

@ApiTags('Admin - Users')
@Controller('admin/users')
@Roles(RoleEnum.USER)
@UseGuards(AccessTokenGuard, EmailVerificationGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get('')
  async findAll(
    @Query() { limit, page }: QueryParamsDto,
    @EndpointURL() hostName: string,
  ) {
    return await this.userService.findAll({ limit, page }, hostName);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post('search')
  async search(
    @Body() { q }: SearchDto,
    @Query() { limit, page }: QueryParamsDto,
    @EndpointURL() EndpointURL: string,
  ) {
    return await this.userService.searchUsers(
      { query: q },
      { limit, page },
      EndpointURL,
    );
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post('users')
  async createUser(
    @Body() { email, name, password, phoneNumber, roles }: CreateUserDto,
  ) {
    return await this.userService.createUser(
      email,
      password,
      name,
      phoneNumber,
      roles,
    );
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Patch(':id/block')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.updateUser(id, {
      isDeleted: true,
    });
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Patch(':id/unblock')
  async unblockUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.updateUser(id, {
      isDeleted: false,
    });
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, body);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post(':id/roles')
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() { roles }: AssignRoleDto,
  ) {
    return await this.userService.assignRoles(id, roles);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id/roles')
  async removeRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() { roles }: AssignRoleDto,
  ) {
    return await this.userService.removeRoles(id, roles);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  async deleteUserPermanently(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}
