import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet, PetCategory } from 'src/models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet) private petModel: typeof Pet,
    @InjectModel(PetCategory) private petCategoryModel: typeof PetCategory,
  ) {}
  async create(createPetDto: CreatePetDto, userId: number) {
    const petCategory = await this.petCategoryModel.findOne({
      where: { id: createPetDto.petCategoryId },
    });

    if (!petCategory) throw new BadRequestException('Pet category not found');

    const pet = await this.petModel.create({
      ...createPetDto,
      userId,
    });
    return pet;
  }

  async findAll() {
    return await this.petModel.findAll();
  }

  async findAllByUserId(userId: number) {
    return await this.petModel.findAll({
      where: { userId },
    });
  }

  async findOne(petId: number) {
    return await this.petModel.findOne({
      where: { id: petId },
    });
  }

  async findOneByUserId(petId: number, userId: number) {
    return await this.petModel.findOne({
      where: { id: petId, userId },
    });
  }

  async update(petId: number, updatePetDto: UpdatePetDto) {
    const pet = await this.petModel.findOne({
      where: { id: petId },
    });

    if (!pet) throw new BadRequestException('Pet not found.');

    await pet.update(updatePetDto);

    return pet;
  }

  async updateByUserId(
    petId: number,
    updatePetDto: UpdatePetDto,
    userId: number,
  ) {
    const pet = await this.petModel.findOne({
      where: { id: petId, userId },
    });

    if (!pet) throw new BadRequestException('Pet not found.');

    await pet.update(updatePetDto);

    return pet;
  }

  async remove(petId: number) {
    const pet = await this.petModel.findOne({
      where: { id: petId },
    });

    if (!pet) throw new BadRequestException('Pet not found.');

    await pet.destroy();

    return pet;
  }

  async removeByUserId(petId: number, userId: number) {
    const pet = await this.petModel.findOne({
      where: { id: petId, userId },
    });

    if (!pet) throw new BadRequestException('Pet not found.');

    await pet.destroy();

    return pet;
  }
}
