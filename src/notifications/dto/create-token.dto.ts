import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateTokenDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User ID',
    example: '12345', // Replace with a sample user ID
  })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Expo token',
    example: 'ExpoPushToken[XXXXXXXXXXXXXXXXXXXXXX]', // Replace with a sample Expo token
  })
  expoToken: string;
 
  @IsNotEmpty()
  @ApiProperty({
    description: 'User Phone Number',
    example: '9665XXXXXXXX', 
  })
  userPhoneNumber: string;
}
