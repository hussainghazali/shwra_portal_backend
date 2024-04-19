import {
    IsNotEmpty,
    IsEmail,
    Length,
    IsNumberString,
    Matches,
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateUserDto {
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
      description: 'new user name',
      minLength: 1,
      maxLength: 255,
      example: 'Saud',
    })
    name: string;

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
  