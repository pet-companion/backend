import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { Otp } from './otp.model';

@Table
export class User extends Model<User> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  phoneNumber: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDeleted: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isVerified: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  refreshToken: string;

  @HasOne(() => Otp)
  otp: Otp;
}
