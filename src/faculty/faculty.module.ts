import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';

@Module({
  controllers: [FacultyController],
  providers: [FacultyService],
})
export class FacultyModule {}
