import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePetDto, UpdatePetDto } from 'src/dtos/pet';
import { Pet, PetCategory } from 'src/models';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';

// TODO - Filter pets by pet category

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
    const pets = await this.petModel.findAll();

    if (!pets.length) throw new BadRequestException('No pets found.');

    return pets;
  }

  async findAllByUserId(userId: number) {
    const pets = await this.petModel.findAll({
      where: { userId },
    });

    if (!pets.length) throw new BadRequestException('No pets found.');

    return pets;
  }

  async findOne(petId: number) {
    const pet = await this.findOnePet(petId);

    if (!pet) throw new BadRequestException('Pet not found.');

    return pet;
  }

  async findOneByUserId(petId: number, userId: number) {
    const pet = await this.findOnePet(petId, userId);

    if (!pet) throw new BadRequestException('Pet not found.');

    return pet;
  }

  async update(petId: number, updatePetDto: UpdatePetDto) {
    const pet = await this.findOnePet(petId);

    await pet.update(updatePetDto);

    return pet;
  }

  async updateByUserId(
    petId: number,
    updatePetDto: UpdatePetDto,
    userId: number,
  ) {
    const pet = await this.findOnePet(petId, userId);

    await pet.update(updatePetDto);

    return pet;
  }

  async remove(petId: number) {
    await this.petModel.update(
      { isDeleted: true },
      { where: { id: petId }, returning: true },
    );

    return await this.findOnePet(petId);
  }

  async removeByUserId(petId: number, userId: number) {
    await this.petModel.update(
      { isDeleted: true },
      { where: { id: petId, userId }, returning: true },
    );

    return await this.findOnePet(petId, userId);
  }

  private async findOnePet(petId: number, userId?: number) {
    const where: WhereOptions<Pet> = userId
      ? { id: petId, userId }
      : { id: petId };

    const pet = await this.petModel.findOne({
      where,
    });

    if (!pet) throw new BadRequestException('Pet not found.');

    return pet;
  }

  // private async findAllPets(userId?: number) {
  //   const pets = await this.petModel.findAll({
  //     where: { userId },
  //   });

  //   if (!pets.length) throw new BadRequestException('No pets found.');

  //   return pets;
  // }
}
