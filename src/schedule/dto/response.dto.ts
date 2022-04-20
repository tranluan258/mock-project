import { Schedule } from './../entities/schedule.entity';
import { ApiProperty } from '@nestjs/swagger';
export class ResponseScheduleDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Schedule })
  data: Schedule;
}

export class ResponseListScheduleDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Schedule, isArray: true })
  data: Schedule[];
}
