import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeslotService } from './timeslot.service';
import { TimeslotController } from './timeslot.controller';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), LoggerModule],
  controllers: [TimeslotController],
  providers: [TimeslotService],
  exports: [TimeslotService],
})
export class TimeslotModule {}
