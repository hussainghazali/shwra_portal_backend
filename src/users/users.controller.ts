import { Controller, Get, Post, Body, Req, UnauthorizedException, Request, UseInterceptors, UploadedFile, Put, UsePipes, Param, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { LoginWithOtpDto } from './dto/login-with-otp.dto';
import { RegisterWithOtpDto } from './dto/register-with-otp.dto';
import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { UpdatePasswordDto } from './dto/reset-password.dto';
import { PasswordConfirmationPipe } from 'src/middleware/password-confirmation.pipe';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import { LoggerService } from 'src/logger/logger.service';
import { AddUserRating } from './dto/add-rating.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
    ) {}

  @Public()
  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.register(registerUserDto, file);
      this.logger.log('User Created', 'UsersController');
      return { message: 'User created successfully', user, statusCode: HttpStatus.CREATED };
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to create user' };
    }
  }

  @Public()
  @Post('register/admin')
  @UseInterceptors(FileInterceptor('file'))
  async registerAdmin(
    @Body() registerAdminDto: RegisterAdminDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const admin = await this.usersService.registerAdmin(registerAdminDto, file);
      this.logger.log('Admin Created', 'UsersController');
      return { message: 'Admin created successfully', admin, statusCode: HttpStatus.CREATED };
    } catch (error) {
      this.logger.error('Failed to create admin', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to create admin' };
    }
  }

  @Public()
  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    try {
      this.logger.log('User Forgot Password', 'UsersController');
      const result = await this.usersService.forgetPassword(forgetPasswordDto);
      return { message: 'Password reset link sent successfully', result, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to send password reset link', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to send password reset link' };
    }
  }

  @Public()
  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  update(@Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const { sub } = req.user as JwtPayload;
    this.logger.log('User Updated', 'UsersController');
    return this.usersService.update(updateUserDto, sub, file);
  }

  @Public()
  @Put(':email/reset-password')
  @UsePipes(PasswordConfirmationPipe)
  async resetPassword(@Param('email') email: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    try {
      this.logger.log('User Password Reset', 'UsersController');
      const result = await this.usersService.resetPassword(email, updatePasswordDto);
      return { message: 'Password reset successfully', result, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to reset password', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to reset password' };
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      this.logger.log('User Logged In', 'UsersController');
      const result = await this.usersService.login(loginUserDto);
      return { message: 'User logged in successfully', access_token: result.access_token, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to log in user', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials' };
    }
  }

  @Public()
  @Post('requestOtp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    try {
      this.logger.log('User OTP Requested', 'UsersController');
      const result = await this.usersService.requestOtp(requestOtpDto);
      return { message: 'OTP requested successfully', result, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to request OTP', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to request OTP' };
    }
  }

  @Public()
  @Post('loginWithOtp')
  async loginWithOtp(@Body() loginWithOtpDto: LoginWithOtpDto) {
    try {
      this.logger.log('User Logged In with OTP', 'UsersController');
      const result = await this.usersService.loginWithOtp(loginWithOtpDto);
      return { message: 'User logged in with OTP successfully', result, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to log in with OTP', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to log in with OTP' };
    }
  }

  @Public()
  @Post('registerWithOtp')
  async registerWithOtp(@Body() registerWithOtpDto: RegisterWithOtpDto) {
    try {
      this.logger.log('User Registered with OTP', 'UsersController');
      const result = await this.usersService.registerWithOtp(registerWithOtpDto);
      return { message: 'User registered with OTP successfully', result, statusCode: HttpStatus.CREATED };
    } catch (error) {
      this.logger.error('Failed to register with OTP', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to register with OTP' };
    }
  }

  private tokenBlacklist: Set<string> = new Set(); // In-memory token blacklist

  @Post('logout')
  logout(@Req() req: any) {
    try {
      const { sub } = req.user as JwtPayload;
      if (!sub) {
        throw new UnauthorizedException('Invalid token');
      }

      // Add the token to the blacklist
      this.tokenBlacklist.add(sub);
      this.logger.log('User Logged Out', 'UsersController');
      return { message: 'Session expired successfully', statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to logout', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.UNAUTHORIZED, message: 'Failed to logout' };
    }
  }

  @Get('me')
  async myProfile(@Req() req: any) {
    try {
      const { sub } = req.user as JwtPayload;
      this.logger.log('User Profile Fetched', 'UsersController');
      const userProfile = await this.usersService.myProfile(sub);
      return { ...userProfile, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to fetch user profile', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.UNAUTHORIZED, message: 'Failed to fetch user profile' };
    }
  }

  @Get()
  async getAllUsers() {
    try {
      const allUsers = await this.usersService.getAllUsers();
      if (!allUsers) {
        return { message: "No users found", statusCode: HttpStatus.NOT_FOUND };
      }
      this.logger.log('User Fetched', 'UsersController');
      return { ...allUsers, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to fetch users' };
    }
  }

  @Get('customers')
  async getAllCustomers() {
    try {
      const allCustomers = await this.usersService.getAllCustomers();
      if (!allCustomers) {
        return { message: "No customers found", statusCode: HttpStatus.NOT_FOUND };
      }
      this.logger.log('Customers Fetched', 'UsersController');
      return { ...allCustomers, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to fetch customers', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to fetch customers' };
    }
  }

  @Get('providers')
  async getAllProviders() {
    try {
      const allProviders = await this.usersService.getAllProviders();
      if (!allProviders) {
        return { message: "No providers found", statusCode: HttpStatus.NOT_FOUND };
      }
      this.logger.log('Providers Fetched', 'UsersController');
      return { ...allProviders, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error('Failed to fetch providers', error.stack, 'UsersController');
      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to fetch providers' };
    }
  }

  @Put(":userId/location")
  @ApiOperation({ summary: "Update Location By User ID" })
  @ApiResponse({ status: 200, description: "Location UPDATED" })
  @ApiResponse({
    status: 400,
    description: "BAD REQUEST",
  })
  async updateLocation(
    @Param('userId') userId: string,
    @Body() updateUserLocationDto: UpdateUserLocationDto,
  ) {
    try {
      const result = await this.usersService.updateLocation(userId, updateUserLocationDto);
      this.logger.log('User Fetched', 'UsersController');
      return { success: true, data: result, statusCode: HttpStatus.OK };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Put(":userId/rating")
  @ApiOperation({ summary: "Update Rating By User ID" })
  @ApiResponse({ status: 200, description: "Rating UPDATED" })
  @ApiResponse({
    status: 400,
    description: "BAD REQUEST",
  })
  async postRating(
    @Param('userId') userId: string,
    @Body() addUserRating: AddUserRating,
  ) {
    try {
      const result = await this.usersService.updateRating(userId, addUserRating);
      this.logger.log('User Rating Added', 'UsersController');
      return { success: true, data: result, statusCode: HttpStatus.OK };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Get(":userId/details")
  @ApiOperation({ summary: "Fetch Detail By User ID" })
  @ApiResponse({ status: 200, description: "Details FETCHED" })
  @ApiResponse({
    status: 400,
    description: "BAD REQUEST",
  })
  async fetchUserDetails(
    @Param('userId') userId: string,
  ) {
    try {
      const result = await this.usersService.findUserById(userId);
      this.logger.log('User Fetched', 'UsersController');
      return { success: true, data: result, statusCode: HttpStatus.OK };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'An error occurred while processing your request',
      });
    }
  }
}
