import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumberString,
  Matches,
  IsUUID,
} from 'class-validator';

export class LoginWithOtpDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(12, 12)
  @Matches(/^9665\d{8}$/, {
    message:
      'phone number must be a valid saudi number in the shape of 9665xxxxxxxx',
  })
  @ApiProperty({
    description: 'the user phone number',
    minLength: 12,
    maxLength: 12,
    example: '9665xxxxxxxx',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID(4)
  @ApiProperty({
    description: 'the otp id',
  })
  otpId: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  @ApiProperty({
    description: 'the otp code',
    minLength: 6,
    maxLength: 6,
    example: '123456',
  })
  otpCode: string;
}
