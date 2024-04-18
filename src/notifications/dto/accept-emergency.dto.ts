import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class AcceptEmergencyDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "ID of the associated notification",
    example: "f560fb7f-0942-4ec3-b292-1a4b0bdf0958",
    required: true,
  })
  notificationId: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Emergency Accepted or Not Accepted By the User',
    example: true,
  })
  acceptEmergency: boolean;
}
