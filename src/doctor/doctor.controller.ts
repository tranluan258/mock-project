import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from './../auth/guard/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Logger } from 'winston';
import { ResponseDoctorDto, ResponseListDoctorDto } from './dto/response.dto';

@ApiTags('Doctor')
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseDoctorDto,
  })
  @Post('create-doctor')
  @UseGuards(new JwtGuard(Role.Admin))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<object> {
    try {
      const result: Doctor = await this.doctorService.create(createDoctorDto);
      return {
        message: 'Create doctor success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error create doctor',
        error,
        context: 'DoctorController:create',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseListDoctorDto,
  })
  @Get('get-all-doctor')
  @UseGuards(new JwtGuard(Role.Employee))
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    try {
      const result: Doctor[] = await this.doctorService.findAll();
      return {
        message: 'List doctor',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error findAll doctor',
        error,
        context: 'DoctorController:findAll',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDoctorDto,
  })
  @Get('get-doctor-by-id/:id')
  @UseGuards(new JwtGuard(Role.Employee))
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result: Doctor = await this.doctorService.findById(id);
      return {
        message: 'The doctor',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error findById doctor',
        error,
        context: 'DoctorController:findById',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Put('update-doctor/:id')
  @UseGuards(new JwtGuard(Role.Admin))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<object> {
    try {
      const result: UpdateResult = await this.doctorService.update(
        id,
        updateDoctorDto,
      );
      return {
        message: 'Update doctor success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error update doctor',
        error,
        context: 'DoctorController:update',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Delete('delete-doctor/:id')
  @UseGuards(new JwtGuard(Role.Admin))
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result: DeleteResult = await this.doctorService.delete(id);
      return {
        message: 'Delete doctor success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error delete doctor',
        error,
        context: 'DoctorController:delete',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
