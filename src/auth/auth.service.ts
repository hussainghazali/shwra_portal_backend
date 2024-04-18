import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignOptions } from 'jsonwebtoken';
import { User, UserType } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { Otp } from './entities/otp.entity';
import { RequestOtpDto } from 'src/users/dto/request-otp.dto';
import { LoginWithOtpDto } from 'src/users/dto/login-with-otp.dto';
import { RegisterWithOtpDto } from 'src/users/dto/register-with-otp.dto';
import { config } from 'dotenv';
import { RegisterAdminDto } from 'src/users/dto/register-admin.dto';
import { EmailService } from 'src/email/email.service';

config(); // Load environment variables from .env file

export type JwtPayload = {
  sub: string;
  email: string;
  phoneNumber: string;
  name: string;
  rating: number;
} & (
  | {
      type: UserType.ADMIN;
    }
  | {
      type: UserType.CUSTOMER;
      customerId?: string;
    }
  | {
      type: UserType.PROVIDER;
      providerId?: string;
    }
);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async requestOtp(requestOtpDto: RequestOtpDto) {
    const { phoneNumber, type, reason } = requestOtpDto;
    let existingNumbers: any;
  
    // Check if the phone number exists
    if(reason != 'Register') { 
    existingNumbers = await this.otpRepository.findOne({ where: { inbox: phoneNumber } });
    if (!existingNumbers) {
      // If the number doesn't exist, return an error or handle as needed
      return null;
    }
    }
  
    // const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code = '000000';
    
    // Create and save the OTP object
    const otp = this.otpRepository.create({
      type,
      inbox: phoneNumber,
      code,
      reason,
    });
  
    return this.otpRepository.save(otp);
  }  

  async register(registerUserDto: RegisterUserDto, file: any) {
    const { email, password, firstName, lastName, phoneNumber, type } = registerUserDto;
    const user = await this.userRepository.save({
      email,
      firstName,
      lastName,
      phoneNumber,
      password: await bcrypt.hash(password, 10),
      type,
      fileId: file ?? null,
      isActive: true,
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: user.type,
      phoneNumber: user.phoneNumber,
      name: `${user.firstName} ${user.lastName}`,
      rating: user.rating,
    };

    const options: SignOptions = {
      // Define your JWT signing options here
      expiresIn: '24h', // For example, token expires in 24 hour testing purpose
      // Add other options as needed
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      ...options,
    });

    return {
      access_token: accessToken,
    };
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto, file: any) {
    const { companyName, fullName, email, password, confirmPassword } = registerAdminDto;
    // Splitting the full name into an array of first and last name
    const nameArray = fullName.split(' ');
    // Destructuring the array into firstName and lastName
    const [firstName, lastName] = nameArray;
    const admin = await this.userRepository.save({
      companyName,
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      confirmPassword: await bcrypt.hash(confirmPassword, 10),
      fileId: file ?? null,
      isEmailVerified: false,
      isActive: true,
      type: UserType.ADMIN
    });

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      type: admin.type,
      phoneNumber: admin.phoneNumber ? admin.phoneNumber : '',
      name: `${admin.firstName} ${admin.lastName}`,
      rating: admin.rating
    };

    const options: SignOptions = {
      // Define your JWT signing options here
      expiresIn: '24h', // For example, token expires in 24 hour testing purpose
      // Add other options as needed
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      ...options,
    });

    // send welcome mail
    await this.emailService.sendUserWelcome(admin, accessToken);

    return {
      access_token: accessToken,
    };
  }

  async registerWithOtp(registerWithOtpDto: RegisterWithOtpDto) {
    const { otpId, otpCode, phoneNumber, firstName, lastName } =
      registerWithOtpDto;

    const otp = await this.otpRepository.findOne({
      where: {
        id: otpId,
        isConsumed: false,
      },
    });
    if (!otp) {
      return null;
    }
    if (otp.code !== otpCode) {
      otp.isConsumed = true;
      otp.isVerified = false;
      await this.otpRepository.save(otp);
      return null;
    }
    otp.isConsumed = true;
    otp.isVerified = true;
    await this.otpRepository.save(otp);
    const user = await this.userRepository.save({
      phoneNumber,
      firstName,
      lastName,
      type: UserType.PROVIDER,
      isActive: true,
    });
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: user.type,
      phoneNumber: user.phoneNumber,
      name: `${user.firstName} ${user.lastName}`,
      rating: user.rating
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }
    if (!user.isActive) {
      return null;
    }
    const payload = await this.getProfile(user.id);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginWithOtp(loginWithOtpDto: LoginWithOtpDto) {
    const otp = await this.otpRepository.findOne({
      where: {
        id: loginWithOtpDto.otpId,
        isConsumed: false,
      },
    });
    if (!otp) {
      return null;
    }
    if (otp.code !== loginWithOtpDto.otpCode) {
      otp.isConsumed = true;
      otp.isVerified = false;
      await this.otpRepository.save(otp);
      return null;
    }
    otp.isConsumed = true;
    otp.isVerified = true;
    await this.otpRepository.save(otp);
    const user = await this.userRepository.findOne({
      where: { phoneNumber: otp.inbox },
    });
    if (!user) {
      return null;
    }
    const payload = await this.getProfile(user.id);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return null;
    }

    let payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: user.type,
      phoneNumber: user.phoneNumber,
      name: `${user.firstName} ${user.lastName}`,
      rating: user.rating
    };

      payload = {
        sub: user.id,
        email: user.email,
        type: user.type,
        phoneNumber: user?.phoneNumber,
        name: user?.firstName + ' ' + user?.lastName,
        rating: user.rating
      };

      payload = {
        sub: user.id,
        email: user.email,
        type: user.type,
        phoneNumber: user.phoneNumber,
        name: `${user.firstName} ${user.lastName}`,
        rating: user.rating
      };

    return payload;
  }

  verifyToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token);
  }
}
