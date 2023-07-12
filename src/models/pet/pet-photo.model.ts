import {
  Table,
  Model,
  DataType,
  Column,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Pet } from './pet.model';

@Table
export class PetPhoto extends Model<PetPhoto> {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  photoUrl: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isUploaded: boolean;

  @ForeignKey(() => Pet)
  @Column
  petId: number;

  @BelongsTo(() => Pet)
  pet: Pet;
}
