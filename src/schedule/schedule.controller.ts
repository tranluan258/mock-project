import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AssignScheduleDto } from './dto/assign-schedule.dto';
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
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  Put,
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
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';

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
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('get-all-schedule')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<object> {
    try {
      const key = `schedule/${page}/${limit}`;

      const listSchedule: string = await this.cacheManager.get(key);
      if (listSchedule != null)
        return {
          message: 'List schedule',
          data: JSON.parse(listSchedule),
        };

      const result: Pagination<Schedule> = await this.scheduleService.findAll({
        page,
        limit,
      });
      setTimeout(async () => {
        await this.cacheManager.set(key, JSON.stringify(result.items), {
          ttl: 3600 * 24,
        });
      });

      return {
        message: 'List schedule',
        data: result.items,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error schedule findAll: ',
        error,
        context: 'ScheduleController:findAll',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseScheduleDto,
  })
  @Get('get-schedule-by-id/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result: Schedule = await this.scheduleService.findById(id);
      return {
        message: 'The schedule',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error schedule findById: ',
        error,
        context: 'ScheduleController:findById',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Put('assign-schedule')
  @HttpCode(HttpStatus.OK)
  async assignSchedule(
    @Body() assignScheduleDto: AssignScheduleDto,
  ): Promise<object> {
    try {
      const result: UpdateResult = await this.scheduleService.assignSchedule(
        assignScheduleDto,
      );

      if (result.affected <= 0)
        throw new HttpException(
          'Not found schedule or status not CREATE',
          HttpStatus.NOT_FOUND,
        );

      return {
        message: 'Assign schedule success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error schedule assignSchedule: ',
        error,
        context: 'ScheduleController:assignSchedule',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Put('update-schedule/:id')
  @HttpCode(HttpStatus.OK)
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<object> {
    try {
      const result: UpdateResult = await this.scheduleService.updateSchedule(
        id,
        updateScheduleDto,
      );

      if (result.affected <= 0)
        throw new HttpException('Not found schedule', HttpStatus.NOT_FOUND);

      return {
        message: 'Update schedule success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error schedule updateSchedule: ',
        error,
        context: 'ScheduleController:updateSchedule',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
