import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAppointmentDto {
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    description: 'user id',
    minLength: 1,
    maxLength: 255,
    example: '1',
  })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user name',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  industryType: string;


  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user name',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  legalIssue: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user name',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  meetingType: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user name',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  meetingDate: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'new user name',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  meetingTime: string;

}
