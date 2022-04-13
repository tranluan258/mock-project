import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@UseGuards(new JwtGuard(Role.Admin))
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
}
