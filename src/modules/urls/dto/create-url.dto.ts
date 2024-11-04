import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original long URL',
    example: 'https://example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  longUrl: string;
}
