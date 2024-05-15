import {
    IsNotEmpty,
    IsString,
    Length,
    IsOptional,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateAppointmentDto {
    
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
  