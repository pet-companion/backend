import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { hash } from 'bcrypt';
import { FindOptions, Transaction } from 'sequelize';
import { RoleEnum } from 'src/enums';
import { User, Role, UserRoles } from 'src/models';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(UserRoles) private userRolesModel: typeof UserRoles,
  ) {}

  private readonly findOptions: FindOptions<User> = {
    include: [{ model: Role, attributes: ['name'] }],
    attributes: { exclude: ['password'] },
  };

  async findUserById(userId: number, transaction?: Transaction) {
    const user = await this.userModel.findOne({
      where: { id: userId },
      ...this.findOptions,
      transaction,
    });

    return user;
  }

  async findUserByEmail(email: string, transaction?: Transaction) {
    const user = await this.userModel.findOne({
      where: { email },
      ...this.findOptions,
      attributes: { include: ['password'] },
      transaction,
    });

    return user;
  }

  async findUserByPhoneNumber(phoneNumber: string, transaction?: Transaction) {
    return await this.userModel.findOne({
      where: { phoneNumber },
      ...this.findOptions,
      transaction,
    });
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    roles: RoleEnum[],
  ) {
    const hashedPassword = await hash(password, 10);

    const transaction = await this.userModel.sequelize.transaction();

    try {
      const user = await this.userModel.create(
        {
          email,
          password: hashedPassword,
          name,
          phoneNumber,
        },
        { transaction },
      );

      roles.forEach(async (role) => {
        const foundRole = await this.roleModel.findOne({
          where: { name: role },
          transaction,
        });

        if (!foundRole) {
          throw new BadRequestException(`Role ${role} does not exist.`);
        }

        await this.userRolesModel.create(
          {
            userId: user.id,
            roleId: foundRole.id,
          },
          { transaction },
        );
      });

      const createdUser = await this.findUserById(user.id, transaction);

      await transaction.commit();

      return createdUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateUser(
    userId: number,
    newUserData: {
      email?: string;
      password?: string;
      name?: string;
      phoneNumber?: string;
      isVerified?: boolean;
      refreshToken?: string;
    },
    transaction?: Transaction,
  ) {
    if (newUserData.password) {
      newUserData.password = await hash(newUserData.password, 10);
    }
    const updatedUser = await this.userModel.update(
      { ...newUserData },
      { where: { id: userId }, returning: true, transaction },
    );

    return updatedUser[1];
  }

  async deleteUser(userId: number, transaction?: Transaction) {
    return await this.userModel.destroy({ where: { id: userId }, transaction });
  }
}
