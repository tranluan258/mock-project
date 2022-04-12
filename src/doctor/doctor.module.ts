import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
