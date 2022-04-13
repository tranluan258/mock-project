import { Role } from './../account/enum/role.enum';
import { JwtGuard } from './../auth/guard/jwt.guard';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(new JwtGuard(Role.Admin))
  @ApiBearerAuth()
  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    return {
      message: 'List patient',
      data: '',
    };
  }
}
