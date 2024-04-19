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
import { FilesService } from 'src/files/files.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ExpoToken } from 'src/notifications/entites/expoToken.entity';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { EmailService } from 'src/email/email.service';
import { UpdatePasswordDto } from './dto/reset-password.dto';

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

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const payload = await this.authService.login(email, password);

    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return payload;
  }

  async register(registerUserDto: RegisterUserDto, file?: Express.Multer.File,) {
    
    let fileUpload : any;

    if(file){
    fileUpload = file && (await this.filesService.create(file));
    }

    const user = await this.usersRepository.findOne({
      where: { email: registerUserDto.email },
    });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    const payload = await this.authService.register(registerUserDto, fileUpload ? fileUpload.id : null);

    return payload;
  }

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
    currentUser.fileId = fileUpload? fileUpload.id : currentUser.fileId;
  
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
    const file = await this.filesService.findOne(user?.fileId);
    let fileURL: any;

    if (file?.data) {
      fileURL = this.filesService.generateFileURL(file);
    }   
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
        name: user.name,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
      };
    });

    return {
      message: "All users retrieved successfully",
      data: formattedUsers,
    };
  }
  
  async findUserById(userId: string) {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
