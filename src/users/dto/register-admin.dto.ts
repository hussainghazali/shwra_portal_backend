import {
    IsNotEmpty,
    IsString,
    IsEmail,
    Length,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class RegisterAdminDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    @ApiProperty({
      description: 'new user full name',
      minLength: 1,
      maxLength: 255,
      example: 'Saud',
    })
    companyName: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    @ApiProperty({
      description: 'new user full name',
      minLength: 1,
      maxLength: 255,
      example: 'Saud',
    })
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    @Length(1, 255)
    @ApiProperty({
      description: 'new user email',
      minLength: 1,
      maxLength: 255,
      example: 'user@guardlink.sa',
    })
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(6, 128)
    @ApiProperty({
      description: 'new user password',
      minLength: 6,
      maxLength: 128,
      example: 'password',
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 128)
    @ApiProperty({
      description: 'new user password',
      minLength: 6,
      maxLength: 128,
      example: 'password',
    })
    confirmPassword: string;
  }
  