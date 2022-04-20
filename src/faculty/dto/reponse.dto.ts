import { ApiProperty } from '@nestjs/swagger';
import { Faculty } from './../entities/faculty.entity';
export class ResponseFacultyDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Faculty })
  data: Faculty;
}

export class ResponseListFacultyDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Faculty, isArray: true })
  data: Faculty[];
}
