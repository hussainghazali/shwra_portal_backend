import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(user: User, token: string) {
    const confirmation_url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to GuardLink App! Confirm your Email',
      template: 'welcome', // `.ejs` extension is appended automatically
      context: { // filling <%= %> brackets with content
        name: user.firstName,
        confirmation_url,
      },
    });
  }

  async sendForgetPassword(email: string) {
    const reset_url = `http://localhost:3000/users/${email}/reset-password`;

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Reset Password Email',
      template: 'forgetPassword', // `.ejs` extension is appended automatically
      context: { // filling <%= %> brackets with content
        reset_url,
        expiration_hours: '1'
      },
    });
  }
}
