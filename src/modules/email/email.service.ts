import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(options: ISendMailOptions) {
    await this.mailService.sendMail(options);
  }
}
