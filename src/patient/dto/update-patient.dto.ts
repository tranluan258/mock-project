import { CreatePatientDto } from './create-patient.dto';
import { PartialType } from '@nestjs/swagger';
export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
