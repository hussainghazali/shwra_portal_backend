import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Length,
  IsNumberString,
  Matches,
  IsEnum,
} from 'class-validator';
import { OTPReason } from 'src/auth/entities/otp.entity';

export class RequestOtpDto {
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
  @ApiProperty({
    description: 'the type of the otp',
    example: 'sms',
  })
  type: 'sms' | 'email';

  @IsNotEmpty()
  @IsEnum(OTPReason)
  @ApiProperty({
    description: 'the reason of the otp',
    example: OTPReason.Register,
  })
  reason: OTPReason;
}
