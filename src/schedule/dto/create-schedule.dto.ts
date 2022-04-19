import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class CreateScheduleDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  dateExamination: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(8)
  @Max(16)
  @ApiProperty()
  hours: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Min(100000)
  price: number;

  dateCreated: Date;

  dateModified: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Min(1)
  patientId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Min(1)
  doctorId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Min(1)
  facultyId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Min(1)
  roomId: number;
}
