import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerService } from 'src/logger/logger.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/reset-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { LoginWithOtpDto } from './dto/login-with-otp.dto';
import { RegisterWithOtpDto } from './dto/register-with-otp.dto';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import { AddUserRating } from './dto/add-rating.dto';
import { HttpStatus } from '@nestjs/common';
import { PasswordConfirmationPipe } from 'src/middleware/password-confirmation.pipe';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, LoggerService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerAdmin', () => {
    it('should register an admin successfully', async () => {
      const mockedRegisterAdminDto = {} as RegisterAdminDto;
      const mockedFile = {} as Express.Multer.File;

      // jest.spyOn(service, 'registerAdmin').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.registerAdmin(mockedRegisterAdminDto, mockedFile);

      expect(result).toEqual({});
      expect(loggerService.log).toHaveBeenCalledWith('Admin Created', 'UsersController');
    });
  });

  describe('forgetPassword', () => {
    it('should initiate the forget password process successfully', async () => {
      const mockedForgetPasswordDto = {} as ForgetPasswordDto;

      // jest.spyOn(service, 'forgetPassword').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.forgetPassword(mockedForgetPasswordDto);

      expect(result).toEqual({});
      expect(loggerService.log).toHaveBeenCalledWith('User Forgot Password', 'UsersController');
    });
  });

  describe('update', () => {
    it('should update user information successfully', async () => {
      const mockedUpdateUserDto = {} as UpdateUserDto;
      const mockedFile = {} as Express.Multer.File;
      const mockedRequest = { user: { sub: 'user_id' } };

      // jest.spyOn(service, 'update').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.update(mockedUpdateUserDto, mockedFile, mockedRequest);

      expect(result).toEqual({});
      expect(loggerService.log).toHaveBeenCalledWith('User Updated', 'UsersController');
    });
  });

  describe('resetPassword', () => {
    it('should reset user password successfully', async () => {
      const mockedUpdatePasswordDto = {} as UpdatePasswordDto;
      const mockedEmail = 'test@example.com';

      // jest.spyOn(service, 'resetPassword').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.resetPassword(mockedEmail, mockedUpdatePasswordDto);

      expect(result).toEqual({});
      expect(loggerService.log).toHaveBeenCalledWith('User Password Reset', 'UsersController');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockedLoginUserDto = {} as LoginUserDto;

      // jest.spyOn(service, 'login').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.login(mockedLoginUserDto);

      expect(result).toEqual({});
      expect(loggerService.log).toHaveBeenCalledWith('User Logged In', 'UsersController');
    });
  });

  describe('requestOtp', () => {
    it('should initiate OTP request successfully', async () => {
      const mockedRequestOtpDto = {} as RequestOtpDto;

      // jest.spyOn(service, 'requestOtp').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.requestOtp(mockedRequestOtpDto);

      expect(result).toEqual({});
      expect(loggerService.log).toHaveBeenCalledWith('User OTP Requested', 'UsersController');
    });
  });

  describe('loginWithOtp', () => {
    it('should login user with OTP successfully', async () => {
      const mockedLoginWithOtpDto = {} as LoginWithOtpDto;

      // jest.spyOn(service, 'loginWithOtp').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.loginWithOtp(mockedLoginWithOtpDto);

      expect(result).toEqual({});
      expect(loggerService.log).toHaveBeenCalledWith('User Logged In with OTP', 'UsersController');
    });
  });

  describe('registerWithOtp', () => {
    it('should register user with OTP successfully', async () => {
      const mockedRegisterWithOtpDto = {} as RegisterWithOtpDto;

      // jest.spyOn(service, 'registerWithOtp').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.registerWithOtp(mockedRegisterWithOtpDto);

      expect(result).toEqual({});
      expect(loggerService.log).toHaveBeenCalledWith('User Register with OTP', 'UsersController');
    });
  });

  describe('logout', () => {
    it('should log out user successfully', async () => {
      const mockedRequest = { user: { sub: 'user_id' } };

      jest.spyOn(loggerService, 'log');

      const result = await controller.logout(mockedRequest);

      expect(result).toEqual({ message: 'Session expired successfully' });
      expect(loggerService.log).toHaveBeenCalledWith('User Logged Out', 'UsersController');
    });
  });

  describe('myProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockedRequest = { user: { sub: 'user_id' } };
      const mockUserProfile = {}; // Mocked user profile

      // jest.spyOn(service, 'myProfile').mockResolvedValue(mockUserProfile);
      jest.spyOn(loggerService, 'log');

      const result = await controller.myProfile(mockedRequest);

      expect(result).toEqual(mockUserProfile);
      expect(loggerService.log).toHaveBeenCalledWith('User Profile Fetched', 'UsersController');
    });
  });

  // Add more test cases for other methods in a similar manner

  describe('updateLocation', () => {
    it('should update user location successfully', async () => {
      const mockedUpdateUserLocationDto = {} as UpdateUserLocationDto;
      const mockedUserId = 'user_id';

      // jest.spyOn(service, 'updateLocation').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.updateLocation(mockedUserId, mockedUpdateUserLocationDto);

      expect(result).toEqual({ success: true, data: {}, statusCode: HttpStatus.OK });
      expect(loggerService.log).toHaveBeenCalledWith('User Fetched', 'UsersController');
    });
  });

  describe('postRating', () => {
    it('should post user rating successfully', async () => {
      const mockedAddUserRating = {} as AddUserRating;
      const mockedUserId = 'user_id';

      // jest.spyOn(service, 'updateRating').mockResolvedValue({});
      jest.spyOn(loggerService, 'log');

      const result = await controller.postRating(mockedUserId, mockedAddUserRating);

      expect(result).toEqual({ success: true, data: {}, statusCode: HttpStatus.OK });
      expect(loggerService.log).toHaveBeenCalledWith('User Rating Added', 'UsersController');
    });
  });

  describe('fetchUserDetails', () => {
    it('should fetch user details successfully', async () => {
      const mockedUserId = 'user_id';
      const mockUserDetails = {}; // Mocked user details

      // jest.spyOn(service, 'findUserById').mockResolvedValue(mockUserDetails);
      jest.spyOn(loggerService, 'log');

      const result = await controller.fetchUserDetails(mockedUserId);

      expect(result).toEqual({ success: true, data: mockUserDetails, statusCode: HttpStatus.OK });
      expect(loggerService.log).toHaveBeenCalledWith('User Fetched', 'UsersController');
    });
  });
});
