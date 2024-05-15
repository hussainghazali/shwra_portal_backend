import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundExceptionFilter } from './logger/error/404';
import { BadRequestFilter } from './logger/error/400';
import { CreatedInterceptor } from './logger/error/201';
import { ServerErrorFilter } from './logger/error/500';
import { SuccessFilter } from './logger/error/200';
import { FilesModule } from './files/files.module';
import { AppointmentModule } from './appointment/appointment.module';
import { TimeslotModule } from './timeslots/timeslot.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      // ssl: true, // Enable only for production database connection
      // extra: {
      //   ssl: {
      //     rejectUnauthorized: false, // false only for production database connection
      //   },
      // },
    }),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    UsersModule,
    AuthModule,
    NotificationsModule,
    LoggerModule,
    FilesModule,
    AppointmentModule,
    TimeslotModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter, 
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CreatedInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ServerErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SuccessFilter,
    },
  ],
})
export class AppModule {}
