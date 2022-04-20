import { Patient } from './../entities/patient.entity';
import { ApiProperty } from '@nestjs/swagger';
export class ResponsePatientDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Patient })
  data: Patient;
}

export class ResponseListPatientDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Patient, isArray: true })
  data: Patient[];
}
