import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PetCategory } from '../pet/pet-category.model';
import { User } from '../user/user.model';

@Table
export class Post extends Model<Post> {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT('medium'), allowNull: false })
  description: string;

  @Column({ type: DataType.TEXT('long'), allowNull: false })
  content: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPublished: boolean;

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
