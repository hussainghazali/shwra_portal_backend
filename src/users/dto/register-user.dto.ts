import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsNumberString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entities/user.entity';

export class RegisterUserDto {
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
  @Length(1, 255)
  @ApiProperty({
    description: 'new user firstname',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user lastname',
    minLength: 1,
    maxLength: 255,
    example: 'Ali',
  })
  lastName: string;

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

  @IsEnum(UserType)
  @IsNotEmpty()
  @ApiProperty({
    description: 'new user type',
    enum: UserType,
    example: UserType.CUSTOMER,
  })
  type: UserType;

  @IsNotEmpty()
  @IsNumberString()
  @Length(12, 12)
  @Matches(/^9665\d{8}$/, {
    message:
      'contact number must be a valid saudi number in the shape of 9665xxxxxxxx',
  })
  @ApiProperty({
    description: 'new user contact number',
    minLength: 12,
    maxLength: 12,
    example: '9665xxxxxxxx',
  })
  phoneNumber: string;
}
