import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from './../auth/guard/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiTags('Doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiBearerAuth()
  @Post('create-doctor')
  @UseGuards(new JwtGuard(Role.Admin))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<object> {
    const result: Doctor = await this.doctorService.create(createDoctorDto);
    return {
      messsage: 'Create doctor success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Post('get-all-doctor')
  @UseGuards(new JwtGuard(Role.Employee))
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    const result: Doctor[] = await this.doctorService.findAll();
    return {
      messsage: 'List doctor',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Put('update-doctor/:id')
  @UseGuards(new JwtGuard(Role.Admin))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<object> {
    const result: UpdateResult = await this.doctorService.update(
      id,
      updateDoctorDto,
    );
    return {
      messsage: 'Update doctor success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Delete('delete-doctor/:id')
  @UseGuards(new JwtGuard(Role.Admin))
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const result: DeleteResult = await this.doctorService.delete(id);
    return {
      messsage: 'Delete doctor success',
      data: result,
    };
  }
}
