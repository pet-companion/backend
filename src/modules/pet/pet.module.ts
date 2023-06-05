import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pet, PetCategory } from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Pet]),
    SequelizeModule.forFeature([PetCategory]),
  ],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
