import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUserById(id: number) {
    return this.userModel.findOne({
      where: { id },
      attributes: { exclude: ['password', 'refreshToken'] },
      raw: true,
    });
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    return this.userModel.findOne({ where: { phoneNumber } });
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
  ) {
    return this.userModel.create({ email, password, name, phoneNumber });
  }

  async updateUser(id: number, name: string, phoneNumber: string) {
    return this.userModel.update({ name, phoneNumber }, { where: { id } });
  }

  async updateEmailVerificationStatus(userId: number, isVerified: boolean) {
    if (isVerified) throw new ConflictException('User is already verified.');

    const updatedUser = await this.userModel.update(
      { isVerified },
      { where: { id: userId }, returning: true },
    );

    return updatedUser;
  }
  async deleteUser(id: number) {
    return this.userModel.destroy({ where: { id } });
  }
}
