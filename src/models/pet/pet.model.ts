import {
  Table,
  Model,
  DataType,
  Column,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { PetCategory } from './pet-category.model';
import { GenderEnum } from 'src/enums';
import { PetPhoto } from './pet-photo.model';

@Table
export class Pet extends Model<Pet> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  breed: string;

  @Column({
    type: DataType.ENUM(...Object.values(GenderEnum)),
    allowNull: false,
  })
  gender: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isNeuter: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  dateOfBirth: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isDeleted: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => PetCategory)
  @Column
  petCategoryId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => PetCategory)
  petCategory: PetCategory;

  @HasOne(() => PetPhoto)
  petPhoto: PetPhoto;
}
