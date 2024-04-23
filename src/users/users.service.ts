import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// import { RequestOtpDto } from './dto/request-otp.dto';
// import { LoginWithOtpDto } from './dto/login-with-otp.dto';
// import { RegisterWithOtpDto } from './dto/register-with-otp.dto';
import { FilesService } from 'src/files/files.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ExpoToken } from 'src/notifications/entites/expoToken.entity';
// import { RegisterAdminDto } from './dto/register-admin.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { EmailService } from 'src/email/email.service';
import { UpdatePasswordDto } from './dto/reset-password.dto';
// import { UpdateUserLocationDto } from './dto/update-user-location.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ExpoToken)
    private expoTokenRepository: Repository<ExpoToken>,
    private readonly filesService: FilesService,
    private authService: AuthService,
    private emailService: EmailService,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  // async requestOtp(requestOtpDto: RequestOtpDto) {
  //   const otp = await this.authService.requestOtp(requestOtpDto);
  
  //   // Check if the OTP is null (phone number not found)
  //   if (otp === null) {
  //     return {
  //       ok: false,
  //       error: 'Phone number not found',
  //     };
  //   }
  
  //   return {
  //     ok: true,
  //     data: {
  //       otpId: otp.id,
  //     },
  //   };
  // }

  // async loginWithOtp(loginWithOtpDto: LoginWithOtpDto) {
  //   const payload = await this.authService.loginWithOtp(loginWithOtpDto);

  //   if (!payload) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   return payload;
  // }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const payload = await this.authService.login(email, password);

    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return payload;
  }

  // async registerWithOtp(registerWithOtpDto: RegisterWithOtpDto) {
  //   const payload = await this.authService.registerWithOtp(registerWithOtpDto);

  //   if (!payload) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   return payload;
  // }

  async register(registerUserDto: RegisterUserDto) {

    const user = await this.usersRepository.findOne({
      where: { email: registerUserDto.email },
    });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    const payload = await this.authService.register(registerUserDto);

    return payload;
  }

  // async registerAdmin(registerAdminDto: RegisterAdminDto, file?: Express.Multer.File,) {
    
  //   let fileUpload : any;

  //   if(file){
  //   fileUpload = file && (await this.filesService.create(file));
  //   }

  //   const payload = await this.authService.registerAdmin(registerAdminDto, fileUpload ? fileUpload.id : null);

  //   return payload;
  // }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {

    const { email } = forgetPasswordDto;

    // send welcome mail
    await this.emailService.sendForgetPassword(email);

    return true;
  }

  async update(updateUserDto: UpdateUserDto, sub: string, file?: Express.Multer.File,) {
    let fileUpload : any;

    if(file){
    fileUpload = file && (await this.filesService.create(file));
    }

    const { name, email, phoneNumber } = updateUserDto;
    
    // Find the current shift by shiftNumber
    const currentUser = await this.usersRepository.findOne({ where: { id: sub } });
  
    if (!currentUser) {
      return {
        message: 'No user found',
        data: []
      };
    }
  
    // Update the properties of the fetched shift entity
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phoneNumber = phoneNumber;
  
    try {
      const updatedUser = await this.usersRepository.save(currentUser);
      return {
        user: updatedUser,
      };
    } catch (error) {
      return {
        message: 'No user found',
        data: [],
        error
      };
    }
  }

  async resetPassword(email: string, updatePasswordDto: UpdatePasswordDto) {

    const { password, confirmPassword } = updatePasswordDto;

    if(password != confirmPassword) {
      return {
        message: 'Password and Confirm Password are not same',
        data: []
      };
    }
    
    // Find the current shift by shiftNumber
    const currentUser = await this.usersRepository.findOne({ where: { email } });
  
    if (!currentUser) {
      return {
        message: 'No user found',
        data: []
      };
    }
  
    // Update the properties of the fetched shift entity
    currentUser.password = password;
  
    try {
      const updatedUser = await this.usersRepository.save(currentUser);
      return {
        user: updatedUser,
      };
    } catch (error) {
      return {
        message: 'No user found',
        data: [],
        error
      };
    }
  }

  async myProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const payload = await this.authService.getProfile(userId);
    const expoToken = await this.expoTokenRepository.findOne({ where: { userId } });
    // const file = await this.filesService.findOne(user?.fileId);
    let fileURL: any;

    // if (file?.data) {
    //   fileURL = this.filesService.generateFileURL(file);
    // }   
    return { ...payload, id: payload.sub, file: fileURL ?? null, expoToken: expoToken?.expoToken ?? null };
  }

  async getAllUsers() {
    const allUsers = await this.usersRepository.find();

    if (!allUsers || allUsers.length === 0) {
      return {
        message: "No users retrieved",
        data: [],
      };
    }

    const formattedUsers = allUsers.map((user) => {
      return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
      };
    });

    return {
      message: "All users retrieved successfully",
      data: formattedUsers,
    };
  }

  async getAllCustomers() {
    const allUsers = await this.usersRepository.find({
      // where: { type: UserType.CUSTOMER}
    });

    if (!allUsers || allUsers.length === 0) {
      return {
        message: "No users retrieved",
        data: [],
      };
    }

    const formattedUsers = allUsers.map((user) => {
      return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
      };
    });

    return {
      message: "All users retrieved successfully",
      data: formattedUsers,
    };
  }

  async getAllProviders() {
    const allUsers = await this.usersRepository.find({
      // where: { type: UserType.PROVIDER}
    });

    if (!allUsers || allUsers.length === 0) {
      return {
        message: "No users retrieved",
        data: [],
      };
    }

    const formattedUsers = allUsers.map((user) => {
      return {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
      };
    });

    return {
      message: "All users retrieved successfully",
      data: formattedUsers,
    };
  }

  // async updateLocation(userId: string, { city, country, latitude, longitude }: UpdateUserLocationDto) {
  //   try {
  //     const currentUser = await this.usersRepository.findOneOrFail({
  //       where: { id: userId },
  //     });
  
  //     // Update only the fields that are provided in the DTO
  //     if (city !== undefined) currentUser.city = city;
  //     if (country !== undefined) currentUser.country = country;
  //     if (latitude !== undefined) currentUser.latitude = latitude;
  //     if (longitude !== undefined) currentUser.longitude = longitude;
  
  //     // Save the updated user asynchronously
  //     const updatedUser = await this.usersRepository.save(currentUser);
  
  //     return updatedUser; // Return the updated user directly
  //   } catch (error) {
  //     throw new NotFoundException("No User found");
  //   }
  // }

  // async updateRating(userId: string, { rating }: AddUserRating) {
  //   try {
  //     const currentUser = await this.usersRepository.findOneOrFail({
  //       where: { id: userId },
  //     });
  
  //     // Update only the fields that are provided in the DTO
  //     if (rating !== undefined) currentUser.rating = rating;

  //     // Save the updated user asynchronously
  //     const updatedUser = await this.usersRepository.save(currentUser);
  
  //     return updatedUser; // Return the updated user directly
  //   } catch (error) {
  //     throw new NotFoundException("No User found");
  //   }
  // }
  
  async findUserById(userId: string) {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
