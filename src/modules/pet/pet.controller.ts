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
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { AccessTokenGuard } from '../auth/guards';
import { EmailVerificationGuard } from '../auth/guards/email-verification.guard';

// TODO
// Commented methods should be protected bt the RoleGuard // !(admin only)
// TODO

@UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post('user/:userId')
  async create(
    @Body() createPetDto: CreatePetDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.petService.create(createPetDto, userId);
  }

  // @Get()
  // async findAll() {
  //   return await this.petService.findAll();
  // }

  // @Get(':petId')
  // async findOne(@Param('petId', ParseIntPipe) petId: number) {
  //   return await this.petService.findOne(petId);
  // }

  @Get('user/:userId')
  async findAllByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.petService.findAllByUserId(userId);
  }

  @Get(':petId/user/:userId')
  async findOneByUserId(
    @Param('petId', ParseIntPipe) petId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.petService.findOneByUserId(petId, userId);
  }

  // @Patch(':petId')
  // async update(@Param('petId', ParseIntPipe) petId: number, @Body() updatePetDto: UpdatePetDto) {
  //   return await this.petService.update(petId, updatePetDto);
  // }

  @Patch(':petId/user/:userId')
  async updateByUserId(
    @Param('petId', ParseIntPipe) petId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return await this.petService.updateByUserId(petId, updatePetDto, userId);
  }

  // @Delete(':petId')
  // async remove(@Param('petId', ParseIntPipe) id: number) {
  //   return await this.petService.remove(id);
  // }

  @Delete(':petId/user/:userId')
  async removeByUserId(
    @Param('petId', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.petService.removeByUserId(id, userId);
  }
}
