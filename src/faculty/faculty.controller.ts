import { Controller } from '@nestjs/common';
import { FacultyService } from './faculty.service';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}
}
