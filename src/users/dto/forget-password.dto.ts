import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  @ApiProperty({
    example: 'user@example.com',
  })
  email: string;
}
