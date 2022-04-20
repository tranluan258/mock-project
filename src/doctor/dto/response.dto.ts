import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from '../entities/doctor.entity';

export class ResponseDoctorDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Doctor })
  data: Doctor;
}

export class ResponseListDoctorDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Doctor, isArray: true })
  data: Doctor[];
}
