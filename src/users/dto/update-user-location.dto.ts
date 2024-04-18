import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserLocationDto {
  @ApiProperty({ 
    example: 'Riyadh', 
    description: 'The city where the user is located' 
})
  city: string;

  @ApiProperty({ 
    example: 'Saudi Arabia', 
    description: 'The country where the user is located' 
})
  country: string;

  @ApiProperty({ 
    example: 24.7136, 
    description: 'The latitude coordinate of the user\'s location' 
})
  latitude: number;

  @ApiProperty({ 
    example: 46.6753, 
    description: 'The longitude coordinate of the user\'s location' 
})
  longitude: number;
}
