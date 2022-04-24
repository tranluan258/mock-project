import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Status } from '../enum/status.enum';

export class AssignScheduleDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsEnum(Status, { each: true })
  @IsNotEmpty()
  readonly status: Status;
}
