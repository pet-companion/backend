import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Role } from './role.model';

@Table
export class UserRoles extends Model<UserRoles> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Role)
  @Column
  roleId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Role)
  role: Role;
}
