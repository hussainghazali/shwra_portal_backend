import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'src/logger/logger.module';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST') || 'smtp.gmail.com',
          secure: false,
          auth: {
            user: config.get('SMTP_USERNAME') || 'hussainghazali@gmail.com',
            pass: config.get('SMTP_PASSWORD') || 'tvlixyftwofeawdb',
          },
        },
        defaults: {
          from: `"GuardLink App" <${config.get('SMTP_USERNAME') ?? 'hussainghazali@gmail.com'}>`,
        },
        template: {
          dir: join(__dirname, '..', 'email', 'templates'), // Update the template directory
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    LoggerModule
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
