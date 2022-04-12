import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  @IsEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  password: string;
}
