import { Controller, Get, Post, Body, Req, UnauthorizedException, Request, UseInterceptors, UploadedFile, Put, UsePipes, Param, HttpStatus, BadRequestException, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'src/logger/logger.service';
import { TimeslotService } from './timeslot.service';
import { Public } from 'src/auth/auth.guard';

@ApiTags('timeslot')
@Controller('timeslot')
export class TimeslotController {
  constructor(
    private readonly timeslotService: TimeslotService,
    private readonly logger: LoggerService,
    ) {}


    @ApiOperation({ summary: "Fetch TimeSlot" })
    @ApiResponse({ status: 200, description: "TimeSlot fetched successfully" })
    @ApiResponse({ status: 404, description: "Data not found" })
    @HttpCode(200)
    @Public()
    @Get("all")
    async getAllTimeSlotDataFromFile() {
      try {
        this.logger.log('TimeSlot Fetched', 'TimeSlotController');
        const TimeSlotData = await this.timeslotService.getTimeSlotDataFromFile();
        return {
          message: " data fetched successfully",
          ...TimeSlotData,
        };
      } catch (error) {
        console.log("Error inside getAllSlot." , error)
        this.logger.error('Failed to fetch TimeSlotData data', error.stack, 'TimeslotController');
        throw new UnauthorizedException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while processing your request',
        });
      }
    }
}