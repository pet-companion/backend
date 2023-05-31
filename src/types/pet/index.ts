import { GenderEnum, PetCategoryEnum } from 'src/enums';

type PetType = {
  name: string;
  breed: string;
  gender: GenderEnum;
  isNeuter: boolean;
  photoUrl: string;
  dateOfBirth: Date;
  isDeleted: boolean;
  userId: number;
  petCategoryId: number;
};

type PetCategoryType = {
  name: PetCategoryEnum;
};

export { PetCategoryType, PetType };
