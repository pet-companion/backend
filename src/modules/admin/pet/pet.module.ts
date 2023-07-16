import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PetService } from 'src/modules/public/pet/pet.service';
import { PetController } from './pet.controller';
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
