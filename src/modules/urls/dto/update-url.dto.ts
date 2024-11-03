import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({ description: 'The new long URL origin', example: 'https://anotherexample.com' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  longUrl: string;
}
