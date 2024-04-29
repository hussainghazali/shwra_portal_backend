import { Controller, Get, Post, Body, Req, UnauthorizedException, Request, UseInterceptors, UploadedFile, Put, UsePipes, Param, HttpStatus, BadRequestException, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.guard';
import { LoggerService } from 'src/logger/logger.service';
import { RegisterAppointmentDto } from './dto/register-appointment.dto';
import { AppointmentService } from './appointment.service';
import { JwtPayload } from 'src/auth/auth.service';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly logger: LoggerService,
    ) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerAppointmentDto: RegisterAppointmentDto,
  ) {
    try {
      const user = await this.appointmentService.register(registerAppointmentDto);
      this.logger.log('User Created', 'UsersController');
      return { message: 'User created successfully', user, statusCode: HttpStatus.CREATED };
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to create user' };
    }
  }


//   @Public()
//   @Put('update')
//   @UseInterceptors(FileInterceptor('file'))
//   update(@Body() updateUserDto: UpdateUserDto,  @Req() req: any) {
//     const { sub } = req.user as JwtPayload;
//     this.logger.log('User Updated', 'UsersController');
//     return this.usersService.update(updateUserDto, sub);
//   }



  @Get()
  async getAllUsers() {
    try {
      const allUsers = await this.appointmentService.getAllAppointment();
      if (!allUsers) {
        return { message: "No Appointment found", statusCode: HttpStatus.NOT_FOUND };
      }
      this.logger.log('Appointment Fetched', 'AppointmentController');
      return { ...allUsers, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to fetch Appointment', error.stack, 'AppointmentController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to fetch Appointment' };
    }
  }

//   @Get('customers')
//   async getAllCustomers() {
//     try {
//       const allCustomers = await this.usersService.getAllCustomers();
//       if (!allCustomers) {
//         return { message: "No customers found", statusCode: HttpStatus.NOT_FOUND };
//       }
//       this.logger.log('Customers Fetched', 'UsersController');
//       return { ...allCustomers, statusCode: HttpStatus.OK };
//     } catch (error) {
//       this.logger.error('Failed to fetch customers', error.stack, 'UsersController');
//       throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to fetch customers' };
//     }
//   }

 
}
