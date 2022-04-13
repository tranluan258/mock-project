import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  resource: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  action: string;
}
