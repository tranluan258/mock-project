import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from '../entities/doctor.entity';

export class ResponseCreateDto {
  @ApiProperty()
  messgae: string;

  @ApiProperty({ type: Doctor })
  data: Doctor;
}

export class ResponseListDto {
  @ApiProperty()
  messgae: string;

  @ApiProperty({ type: Doctor, isArray: true })
  data: Doctor[];
}
