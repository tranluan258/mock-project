import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddPermissionForAccountDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  accountId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  permissionId: number;
}
