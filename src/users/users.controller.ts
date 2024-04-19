import { Controller, Get, Post, Body, Req, UnauthorizedException, Request, UseInterceptors, UploadedFile, Put, UsePipes, Param, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { UpdatePasswordDto } from './dto/reset-password.dto';
import { PasswordConfirmationPipe } from 'src/middleware/password-confirmation.pipe';
import { LoggerService } from 'src/logger/logger.service';

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
