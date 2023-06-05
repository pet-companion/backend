import {
  Table,
  Model,
  HasMany,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { UserRoles } from './user-roles.model';
import { RoleEnum } from 'src/enums';

@Table
export class Role extends Model<Role> {
  @Column({
    type: DataType.ENUM,
    values: Object.values(RoleEnum),
    allowNull: false,
    defaultValue: RoleEnum.USER,
  })
  name: RoleEnum;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];

  @HasMany(() => UserRoles)
  userRoles: UserRoles[];
}
