import {
  ResponseScheduleDto,
  ResponseListScheduleDto,
} from './dto/response.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  CACHE_MANAGER,
  Inject,
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { Status } from './enum/status.enum';
import { ScheduleService } from './schedule.service';
import { Cache } from 'cache-manager';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Schedule')
@UseGuards(new JwtGuard(Role.Employee))
@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseScheduleDto,
  })
  @Post('create-schedule')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createScheduleDto: CreateScheduleDto): Promise<object> {
    try {
      const timestamp = new Date();
      createScheduleDto.dateCreated = timestamp;
      createScheduleDto.dateModified = timestamp;
      const result = await this.scheduleService.create(createScheduleDto);
      return {
        message: 'Create schedule success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error create schedule: ',
        error,
        context: 'ScheduleController:create',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseListScheduleDto,
  })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @Get('get-all-schedule')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('status') status?: Status): Promise<object> {
    try {
      let key: string;
      status ? (key = 'schedule' + status) : (key = 'schedule');

      const listSchedule: string = await this.cacheManager.get(key);
      if (listSchedule != null)
        return {
          message: 'List schedule',
          data: JSON.parse(listSchedule),
        };

      const result: Schedule[] = await this.scheduleService.findAll(status);
      setTimeout(async () => {
        await this.cacheManager.set(key, JSON.stringify(result), {
          ttl: 3600 * 24,
        });
      });

      return {
        message: 'List schedule',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error create findAll: ',
        error,
        context: 'ScheduleController:findAll',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
