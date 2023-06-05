import { ForbiddenException, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { UniqueConstraintError } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginDto, RegisterDto } from './auth.dto';
import { OtpService } from '../otp/otp.service';
import { UserService } from '../user/user.service';
import { RoleEnum } from 'src/enums';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
    private userService: UserService,
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
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new ForbiddenException('Credentials incorrect.');

    const isPasswordMatches = await compare(password, user.password);
    if (!isPasswordMatches)
      throw new ForbiddenException('Credentials incorrect.');

    const tokens = await this.signTokens({
      userId: user.id,
      name: user.name,
      isVerified: user.isVerified,
      roles: user.roles,
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
  async register({
    email,
    password,
    name,
    phoneNumber,
    roles = [RoleEnum.USER],
  }: RegisterDto) {
    try {
      const newUser = await this.userService.createUser(
        email,
        password,
        name,
        phoneNumber,
        roles,
      );

      const tokens = await this.signTokens({
        userId: newUser.id,
        name: newUser.name,
        isVerified: newUser.isVerified,
        roles: newUser.roles,
      });
      await this.updateRefreshToken(newUser.id, tokens.refresh_token);

      return {
        tokens,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          isVerified: newUser.isVerified,
          isDeleted: newUser.isDeleted,
        },
      };
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
  async logout(userId: number) {
    await this.userService.updateUser(userId, { refreshToken: null });

    return { message: 'Logout successfully.' };
  }

  async verifyEmail(otp: string, user: any) {
    await this.otpService.verifyOtp({ otp }, user.id);

    const updatedUser = await this.userService.updateUser(user.id, {
      isVerified: true,
    });

    return {
      message: 'Email verified successfully.',
      user: updatedUser,
    };
  }

  async sendVerifyEmailOtp(user: any) {
    const userEmail = (await this.userService.findUserById(user.id)).email;

    return await this.otpService.sendOtp(
      {
        email: userEmail,
        message: 'Your verification code is',
        subject: 'Verify your email',
        duration: 2,
      },
      user.id,
      'Verification code sent successfully, please check your email.',
    );
  }

  async resetPassword({ otp, newPassword }: any, user: any) {
    await this.otpService.verifyOtp({ otp }, user.id);

    const updatedUser = await this.userService.updateUser(user.id, {
      password: newPassword,
    });

    return {
      message: 'Password reset successfully.',
      user: updatedUser,
    };
  }

  async sendPasswordResetOtp(user: any) {
    const userEmail = (await this.userService.findUserById(user.id)).email;

    return await this.otpService.sendOtp(
      {
        email: userEmail,
        message: 'Your password reset code is',
        subject: 'Reset your password',
        duration: 2,
      },
      user.id,
      'Password reset code sent successfully, please check your email.',
    );
  }

  /**
   * @param id            User's id
   * @param refreshToken  User's refresh token
   * @returns             tokens and token type
   * @throws              ForbiddenException
   * @description         Refresh access token and return new tokens and token type
   *                      if credentials are correct otherwise throw ForbiddenException
   */
  async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new ForbiddenException('Credentials incorrect.');

    const isRefreshTokenMatches = await compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenMatches)
      throw new ForbiddenException('Credentials incorrect.');

    const tokens = await this.signTokens({
      userId: user.id,
      name: user.name,
      isVerified: user.isVerified,
      roles: user.roles,
    });

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  /**
   * @param id            User's id
   * @param refreshToken  User's refresh token
   * @description         Update user's refresh token
   */
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 12);
    await this.userService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  /**
   * @param id      User's id
   * @param email   User's email
   * @param name    User's name
   * @returns       Access token and token type
   * @description   Sign token with user's id, email and name
   */
  private async signTokens({ userId, name, isVerified = false, roles = [] }) {
    const payload = {
      id: userId,
      name,
      isVerified,
      roles: roles.map((role) => role.name),
    };

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
