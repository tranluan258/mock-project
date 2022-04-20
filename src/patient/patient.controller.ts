import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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
  Inject,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Logger } from 'winston';

@UseGuards(new JwtGuard(Role.Employee))
@ApiTags('Patient')
@Controller('patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  @ApiBearerAuth()
  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    try {
      const result: Patient[] = await this.patientService.findAll();
      return {
        message: 'List patient',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error findAll patient',
        error,
        context: 'PatientController:findAll',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Post('add-patient')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPatientDto: CreatePatientDto): Promise<object> {
    try {
      const result: Patient = await this.patientService.create(
        createPatientDto,
      );
      return {
        message: 'Create patient success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error create patient',
        error,
        context: 'PatientController:create',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Put('update-patient/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<object> {
    try {
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
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error update patient',
        error,
        context: 'PatientController:update',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Delete('delete-patient/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result: DeleteResult = await this.patientService.delete(id);
      if (result.affected <= 0)
        throw new HttpException('Not found patient', HttpStatus.NOT_FOUND);
      return {
        message: 'Delete patient success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error delete patient',
        error,
        context: 'PatientController:delete',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
