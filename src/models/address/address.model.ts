import {
  Model,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class Address extends Model<Address> {
  @Column({ type: DataType.DECIMAL(9, 6), allowNull: true })
  longitude?: number;

  @Column({ type: DataType.DECIMAL(8, 6), allowNull: true })
  latitude?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  streetAddress?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  postalCode: string;

  @Column({ type: DataType.STRING, allowNull: true })
  aptSuiteBldg?: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
