import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { hash } from 'bcrypt';
import { User } from 'src/models';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUserById(userId: number) {
    return await this.userModel.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
      raw: true,
    });
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ where: { email } });
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    return await this.userModel.findOne({ where: { phoneNumber } });
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
  ) {
    const hashedPassword = await hash(password, 10);

    return await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
    });
    ``;
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
  ) {
    const updatedUser = await this.userModel.update(
      { ...newUserData },
      { where: { id: userId }, returning: true },
    );

    return updatedUser[1];
  }

  async updateUserRefreshToken(userId: number, refreshToken: string) {
    return await this.updateUser(userId, { refreshToken });
  }

  async updateEmailVerificationStatus(userId: number, isVerified: boolean) {
    const updatedUser = await this.updateUser(userId, { isVerified });

    return updatedUser;
  }

  async updatePassword(userId: number, newPassword: string) {
    const newHashedPassword = await hash(newPassword, 10);

    const updatedUser = await this.updateUser(userId, {
      password: newHashedPassword,
    });

    return updatedUser;
  }

  async deleteUser(userId: number) {
    return await this.userModel.destroy({ where: { id: userId } });
  }
}
