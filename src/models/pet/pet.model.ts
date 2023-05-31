import {
  Table,
  Model,
  DataType,
  Column,
  ForeignKey,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { PetCategory } from './pet-category.model';
import { GenderEnum, PetCategoryEnum } from 'src/enums';

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

  @Column({ type: DataType.TEXT, allowNull: false })
  photoUrl: string;

  @Column({ type: DataType.DATE, allowNull: false })
  dateOfBirth: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
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
}
