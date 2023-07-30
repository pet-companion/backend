import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from '../../../dtos/address';
import {
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from '../auth/guards';
import { Roles } from 'src/decorators';
import { RoleEnum } from 'src/enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Public - Addresses')
@Controller('addresses')
@UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get()
  async findAll() {
    return await this.addressService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.addressService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.addressService.remove(+id);
  }
}
