import { ForbiddenException, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models';
import { LoginDto, RegisterDto } from './auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';
import { ConfigService } from '@nestjs/config';

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

    return this.signToken(user.id, user.email, user.name);
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
      const user = await this.userService.create({
        email,
        password: hashedPassword,
        name,
        phoneNumber,
      });
      return this.signToken(user.id, user.email, user.name);
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
   * @param id      User's id
   * @param email   User's email
   * @param name    User's name
   * @returns       Access token and token type
   * @description   Sign token with user's id, email and name
   */
  private async signToken(id: number, email: string, name: string) {
    const payload = { id, email, name };
    console.log(this.configService.get('ACCESS_TOKEN_TYPE'));
    return {
      access_token: this.jwt.sign(payload),
      type: this.configService.get('ACCESS_TOKEN_TYPE'),
    };
  }
}
