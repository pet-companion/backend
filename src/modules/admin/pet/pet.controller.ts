import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PetService } from 'src/modules/public/pet/pet.service';
import { UpdatePetDto } from 'src/dtos/pet';

import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/enums';
import {
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from 'src/modules/public/auth/guards';

@ApiTags('Admin - Pets')
@Controller('admin/pets')
@UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll() {
    return await this.petService.findAll();
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':petId')
  async findOne(@Param('petId', ParseIntPipe) petId: number) {
    return await this.petService.findOne(petId);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':petId')
  async update(
    @Param('petId', ParseIntPipe) petId: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return await this.petService.update(petId, updatePetDto);
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':petId')
  async remove(@Param('petId', ParseIntPipe) id: number) {
    return await this.petService.remove(id);
  }
}
