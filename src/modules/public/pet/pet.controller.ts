import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto, UpdatePetDto } from 'src/dtos/pet';
import {
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from '../auth/guards';

import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Public - Pets')
@UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER)
  @Post('user/:userId')
  async create(
    @Body() createPetDto: CreatePetDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.petService.create(createPetDto, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER)
  @Get('user/:userId')
  async findAllByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.petService.findAllByUserId(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER)
  @Get(':petId/user/:userId')
  async findOneByUserId(
    @Param('petId', ParseIntPipe) petId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.petService.findOneByUserId(petId, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER)
  @Patch(':petId/user/:userId')
  async updateByUserId(
    @Param('petId', ParseIntPipe) petId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return await this.petService.updateByUserId(petId, updatePetDto, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER)
  @Delete(':petId/user/:userId')
  async removeByUserId(
    @Param('petId', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.petService.removeByUserId(id, userId);
  }
}
