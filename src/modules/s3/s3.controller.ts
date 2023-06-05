import { Controller, Get, UseGuards } from '@nestjs/common';
import { S3Service } from './s3.service';
import { RoleEnum } from 'src/enums';
import {
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from '../auth/guards';
import { Roles, UserInformation } from 'src/decorators';

@Controller('s3')
@UseGuards(AccessTokenGuard, EmailVerificationGuard)
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Roles(RoleEnum.USER)
  @UseGuards(RolesGuard)
  @Get('upload-url')
  async getUploadUrl(@UserInformation() user: any) {
    return await this.s3Service.getUploadUrl(user.id);
  }
}
