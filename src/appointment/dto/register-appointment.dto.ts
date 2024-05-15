import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAppointmentDto {
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'User ID',
    minLength: 1,
    maxLength: 255,
    example: 'f4fa9ab4-3823-4d1d-8d1c-fb46b62a9aaf',
  })
  userId?: string; // Add ? to make it optional

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'Industry type',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  industryType?: string; // Add ? to make it optional

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'Legal issue',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  legalIssue?: string; // Add ? to make it optional

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    description: 'Meeting type',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  @IsOptional() // Make it optional
  meetingType?: string;

  @IsString()
  @ApiProperty({
    description: 'Meeting date',
    minLength: 1,
    maxLength: 255,
    example: 'Saud',
  })
  @IsOptional() // Make it optional
  meetingSlot?: string;
}
