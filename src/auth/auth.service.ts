import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignOptions } from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { Otp } from './entities/otp.entity';
import { config } from 'dotenv';
import { EmailService } from 'src/email/email.service';

config(); // Load environment variables from .env file

export type JwtPayload = {
  sub: string;
  email: string;
  phoneNumber: string;
  name: string;
}

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
  
  async register(registerUserDto: RegisterUserDto) {
    const { email, password, name, industryType,
      legalIssue,
      meetingType,
      meetingDate,
      meetingTime,
      phoneNumber } = registerUserDto;
    const user = await this.userRepository.save({
      email,
      name,
      phoneNumber,
      industryType,
      legalIssue,
      meetingType,
      meetingDate,
      meetingTime,
      password: await bcrypt.hash(password, 10),
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
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
      phoneNumber: user.phoneNumber,
      name: user.name,
    };

      payload = {
        sub: user.id,
        email: user.email,
        phoneNumber: user?.phoneNumber,
        name: user.name,
      };

      payload = {
        sub: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.name,
      };

    return payload;
  }

  verifyToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token);
  }
}
