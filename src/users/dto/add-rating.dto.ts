import { ApiProperty } from '@nestjs/swagger';

export class AddUserRating {
  @ApiProperty({ 
    example: 3.5, 
    description: 'The rating of Guard' 
})
  rating: number;
}
