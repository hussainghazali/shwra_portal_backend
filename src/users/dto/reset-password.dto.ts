import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 128)
  @ApiProperty({
    example: 'password',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 128)
  @ApiProperty({
    example: 'confirm password',
  })
  confirmPassword: string;
}
