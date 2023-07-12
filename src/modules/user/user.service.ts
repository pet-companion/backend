import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { hash } from 'bcrypt';
import { FindOptions, Sequelize, UniqueConstraintError } from 'sequelize';
import { RoleEnum } from 'src/enums';
import { User, Role, UserRoles, Pet, PetCategory } from 'src/models';
import { QueryParamsDto } from './dto/query-params.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(UserRoles) private userRolesModel: typeof UserRoles,
    @InjectConnection() private sequelize: Sequelize,
  ) {}

  private readonly findOptions: FindOptions<User> = {
    include: [{ model: Role, through: { attributes: [] } }],
    attributes: { exclude: ['password'] },
  };

  async findAll({ limit, page }: QueryParamsDto, EndpointURL: string) {
    const { count, rows } = await this.userModel.findAndCountAll({
      ...this.findOptions,
      limit,
      offset: limit * (page - 1),

      attributes: {
        exclude: ['password', 'refreshToken'],
      },
    });

    return {
      message: count ? 'Successfully retrieved users' : 'No users found',
      data: rows,
      meta: this.generateResponseMeta(
        { count, rows },
        { limit, page },
        EndpointURL,
      ),
    };
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id, {
      ...this.findOptions,
      include: [
        { model: Role, through: { attributes: [] } },
        {
          model: Pet,
          include: [{ model: PetCategory }],
        },
      ],
      attributes: {
        exclude: ['password'],
        include: ['refreshToken'],
      },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return {
      message: 'Successfully retrieved user',
      data: user,
    };
  }

  async searchUsers({ query }, { limit, page }, EndpointURL: string) {
    const { count, rows } = await this.userModel.findAndCountAll({
      ...this.findOptions,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
      },
      limit,
      offset: limit * (page - 1),

      attributes: {
        exclude: ['password', 'refreshToken'],
      },
      distinct: true,
    });

    return {
      message: count ? 'Successfully retrieved users' : 'No users found',
      data: rows,
      meta: this.generateResponseMeta(
        { count, rows },
        { limit, page },
        EndpointURL,
      ),
    };
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    roles: RoleEnum[],
  ) {
    const hashedPassword = await hash(password, 10);

    const transaction = await this.sequelize.transaction();

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

      const createdUser = await this.userModel.findByPk(user.id, {
        transaction,
      });

      await transaction.commit();

      return createdUser;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        await transaction.rollback();
        throw new BadRequestException('Email already exists.');
      }
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
      isDeleted?: boolean;
    },
  ) {
    if (!Object.keys(newUserData).length) {
      throw new BadRequestException('No data to update.');
    }

    if (newUserData.email) {
      const foundUser = await this.userModel.findOne({
        where: { email: newUserData.email },
      });

      if (foundUser) {
        throw new BadRequestException('Email already exists.');
      }
    }

    if (newUserData.phoneNumber) {
      const foundUser = await this.userModel.findOne({
        where: { phoneNumber: newUserData.phoneNumber },
      });

      if (foundUser) {
        throw new BadRequestException('Phone number already exists.');
      }
    }

    if (newUserData.password) {
      newUserData.password = await hash(newUserData.password, 10);
    }
    await this.userModel.update({ ...newUserData }, { where: { id: userId } });

    const response = await this.findOne(userId);

    if (!response.data) {
      throw new BadRequestException('User not found.');
    }

    response.data.refreshToken = undefined;

    return {
      message: 'Successfully updated user',
      data: response.data,
    };
  }

  async assignRoles(userId: number, roles: RoleEnum[]) {
    const response = await this.findOne(userId);

    if (!response.data) {
      throw new BadRequestException('User not found.');
    }

    for (const role of roles) {
      const foundRole = await this.roleModel.findOne({
        where: { name: role },
      });

      if (!foundRole) {
        throw new BadRequestException(`Role ${role} does not exist.`);
      }

      if (response.data.roles.some((userRole) => userRole.name === role)) {
        throw new BadRequestException(`User already has role ${role}.`);
      }

      await this.userRolesModel.create({
        userId: response.data.id,
        roleId: foundRole.id,
      });
    }

    return {
      message: `Successfully assigned roles, [${roles.join(', ')}] to user.`,
    };
  }

  async removeRoles(userId: number, roles: RoleEnum[]) {
    const response = await this.findOne(userId);

    if (!response.data) {
      throw new BadRequestException('User not found.');
    }

    for (const role of roles) {
      const foundRole = await this.roleModel.findOne({
        where: { name: role },
      });

      if (!foundRole) {
        throw new BadRequestException(`Role ${role} does not exist.`);
      }

      if (!response.data.roles.some((userRole) => userRole.name === role)) {
        throw new BadRequestException(`User does not have role ${role}.`);
      }

      await this.userRolesModel.destroy({
        where: {
          userId: response.data.id,
          roleId: foundRole.id,
        },
      });
    }

    return {
      message: `Successfully removed roles, [${roles.join(', ')}] from user.`,
    };
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
      ...this.findOptions,
      attributes: { include: ['password'] },
    });

    return user;
  }

  async deleteUser(userId: number) {
    const deletedRows = await this.userModel.destroy({
      where: { id: userId },
    });

    return {
      message: deletedRows ? 'Successfully deleted user' : 'User not found.',
    };
  }

  private generateResponseMeta(
    { count, rows }: { count: number; rows: User[] },
    { limit, page }: { limit: number; page: number },
    EndpointURL: string,
  ) {
    const totalPage = Math.ceil(count / limit);
    const hasNextPage = page < totalPage;
    const hasPreviousPage = page === 1 || page > totalPage + 1 ? false : true;
    const meta = {
      totalItems: count,
      itemCount: rows.length,
      itemsPerPage: limit,
      totalPages: totalPage,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
      links: {
        self: `${EndpointURL}?page=${page}&limit=${limit}`,
        next: hasNextPage
          ? `${EndpointURL}?page=${page + 1}&limit=${limit}`
          : null,
        previous: hasPreviousPage
          ? `${EndpointURL}?page=${page - 1}&limit=${limit}`
          : null,
        first: `${EndpointURL}?page=1&limit=${limit}`,
        last: `${EndpointURL}?page=${totalPage}&limit=${limit}`,
      },
    };

    return meta;
  }
}
