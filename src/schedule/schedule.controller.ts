import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { Status } from './enum/status.enum';
import { ScheduleService } from './schedule.service';

@ApiTags('Schedule')
@UseGuards(new JwtGuard(Role.Employee))
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiBearerAuth()
  @Post('create-schedule')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createScheduleDto: CreateScheduleDto): Promise<object> {
    const timestamp = new Date();
    createScheduleDto.dateCreated = timestamp;
    createScheduleDto.dateModified = timestamp;
    const result = await this.scheduleService.create(createScheduleDto);
    return {
      message: 'Create schedule success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @Get('get-all-schedule')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('status') status?: Status): Promise<object> {
    const result: Schedule[] = await this.scheduleService.findAll(status);
    return {
      message: 'List schedule',
      data: result,
    };
  }
}
