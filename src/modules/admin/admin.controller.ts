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
} from '../auth/guards';
import { RoleEnum } from 'src/enums';
import { EndpointURL, Roles } from 'src/decorators';
import { UserService } from '../user/user.service';
import { QueryParamsDto, SearchDto } from '../user/dto';
import { AssignRoleDto, CreateUserDto, UpdateUserDto } from './dto';

@Controller('admin')
@UseGuards(AccessTokenGuard, EmailVerificationGuard, RolesGuard)
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get('users')
  async findAll(
    @Query() { limit, page }: QueryParamsDto,
    @EndpointURL() hostName: string,
  ) {
    return await this.userService.findAll({ limit, page }, hostName);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get('users/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post('users/search')
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
  @Patch('users/:id/block')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.updateUser(id, {
      isDeleted: true,
    });
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Patch('users/:id/unblock')
  async unblockUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.updateUser(id, {
      isDeleted: false,
    });
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Patch('users/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, body);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post('users/:id/roles')
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() { roles }: AssignRoleDto,
  ) {
    return await this.userService.assignRoles(id, roles);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete('users/:id/roles')
  async removeRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() { roles }: AssignRoleDto,
  ) {
    return await this.userService.removeRoles(id, roles);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete('users/:id')
  async deleteUserPermanently(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}
