import { Role } from './../account/enum/role.enum';
import { JwtGuard } from './../auth/guard/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@UseGuards(new JwtGuard(Role.Employee))
@ApiTags('Patient')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiBearerAuth()
  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    const result: Patient[] = await this.patientService.findAll();
    return {
      message: 'List patient',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Post('add-patient')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPatientDto: CreatePatientDto): Promise<object> {
    const result: Patient = await this.patientService.create(createPatientDto);
    return {
      message: 'Create patient success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Put('update-patient/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<object> {
    const result: UpdateResult = await this.patientService.update(
      id,
      updatePatientDto,
    );
    if (result.affected <= 0)
      throw new HttpException('Not found patient', HttpStatus.NOT_FOUND);
    return {
      message: 'Update patient success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Delete('delete-patient/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const result: DeleteResult = await this.patientService.delete(id);
    if (result.affected <= 0)
      throw new HttpException('Not found patient', HttpStatus.NOT_FOUND);
    return {
      message: 'Delete patient success',
      data: result,
    };
  }
}
