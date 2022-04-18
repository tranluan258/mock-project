import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEmail, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  facultyId: number;
}
