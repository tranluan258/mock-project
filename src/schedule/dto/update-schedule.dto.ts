import { CreateScheduleDto } from './create-schedule.dto';
import { PartialType } from '@nestjs/swagger';
export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {}
