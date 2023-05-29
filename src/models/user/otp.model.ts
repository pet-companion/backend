import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Otp extends Model<Otp> {
  @Column({ type: DataType.STRING, allowNull: false })
  otp: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresAt: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
