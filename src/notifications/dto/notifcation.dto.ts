import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class NotificationDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the notification',
    example: 'New Message Received', // Replace with an appropriate example
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Body/content of the notification',
    example: 'You have a new message waiting for you.', // Replace with an appropriate example
  })
  body: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'User Phone Number to receive the notification',
    example: '9665XXXXXXXX',
  })
  userPhoneNumber: string;
}
