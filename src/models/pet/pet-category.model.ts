import { Table, Model, DataType, Column, HasMany } from 'sequelize-typescript';
import { PetCategoryEnum } from 'src/enums';
import { Pet } from './pet.model';
import { Post } from '../post/post.model';

@Table
export class PetCategory extends Model<PetCategory> {
  @Column({
    type: DataType.ENUM(...Object.values(PetCategoryEnum)),
    allowNull: false,
  })
  name: string;

  @HasMany(() => Pet)
  pets: Pet[];

  @HasMany(() => Post)
  posts: Post[];
}
