import { ForbiddenException, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/models';

import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userService: typeof User,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * @param email    User's email
   * @param password User's password
   * @returns        Access token and token type
   * @throws         ForbiddenException
   * @description    Login user and return access token and token
   *                 type if credentials are correct otherwise throw ForbiddenException
   */
  async login({ email, password }: LoginDto) {
    const user = await this.userService.findOne({ where: { email: email } });
    if (!user) throw new ForbiddenException('Credentials incorrect.');

    const isPasswordMatches = await compare(password, user.password);
    if (!isPasswordMatches)
      throw new ForbiddenException('Credentials incorrect.');

    const tokens = await this.signTokens({
      id: user.id,
      name: user.name,
      isVerified: user.isVerified,
    });

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
        isDeleted: user.isDeleted,
      },
    };
  }

  /**
   * @param email        User's email
   * @param password     User's password
   * @param name         User's name
   * @param phoneNumber  User's phone number
   * @returns            Access token and token type
   * @throws             ForbiddenException
   * @description        Register user and return access token and token
   *                     type if credentials are correct otherwise throw ForbiddenException
   * @todo               Add validation for phone number
   */
  async register({ email, password, name, phoneNumber }: RegisterDto) {
    try {
      const hashedPassword = await hash(password, 12);
      const newUser = await this.userService.create({
        email,
        password: hashedPassword,
        name,
        phoneNumber,
      });

      const tokens = await this.signTokens({
        id: newUser.id,
        name: newUser.name,
        isVerified: newUser.isVerified,
      });
      await this.updateRefreshToken(newUser.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        if (error.errors[0].path === 'email') {
          throw new ForbiddenException('Credentials taken.');
        }
      }
      throw error;
    }
  }

  /**
   * @param id    User's id
   * @returns     Message
   * @description Logout user
   */
  async logout(id: number) {
    this.userService.update({ refreshToken: null }, { where: { id } });

    return { message: 'Logout successfully.' };
  }

  /**
   * @param id            User's id
   * @param refreshToken  User's refresh token
   * @returns             tokens and token type
   * @throws              ForbiddenException
   * @description         Refresh access token and return new tokens and token type
   *                      if credentials are correct otherwise throw ForbiddenException
   */
  async refresh(id: number, refreshToken: string) {
    const user = await this.userService.findOne({ where: { id } });
    if (!user) throw new ForbiddenException('Credentials incorrect.');

    const isRefreshTokenMatches = await compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenMatches)
      throw new ForbiddenException('Credentials incorrect.');

    const tokens = await this.signTokens({
      id: user.id,
      name: user.name,
      isVerified: user.isVerified,
    });

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  /**
   * @param id            User's id
   * @param refreshToken  User's refresh token
   * @description         Update user's refresh token
   */
  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 12);
    await this.userService.update(
      { refreshToken: hashedRefreshToken },
      { where: { id } },
    );
  }

  /**
   * @param id      User's id
   * @param email   User's email
   * @param name    User's name
   * @returns       Access token and token type
   * @description   Sign token with user's id, email and name
   */
  private async signTokens({ id, name, isVerified = false }) {
    const payload = { id, name, isVerified };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      type: this.configService.get('ACCESS_TOKEN_TYPE'),
    };
  }
}
