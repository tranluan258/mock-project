import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { MailDataDto } from './dto/mail-data.dto';
import { Status } from './enum/status.enum';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepositories: Repository<Schedule>,
    @Inject('MAIL_SERVICE') private clientMailService: ClientProxy,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const result: Schedule = await this.scheduleRepositories.save(
      createScheduleDto,
    );

    const schedule: Schedule = await this.scheduleRepositories.findOne({
      where: {
        id: result.id,
      },
      relations: ['doctor', 'patient'],
    });

    const mailDataDoctor: MailDataDto = {
      email: schedule.doctor.email,
      name: schedule.doctor.name,
      dateExamination: schedule.dateExamination,
      hours: schedule.hours,
    };

    const mailDataPatient: MailDataDto = {
      email: schedule.patient.email,
      name: schedule.patient.name,
      dateExamination: schedule.dateExamination,
      hours: schedule.hours,
    };

    await this.clientMailService
      .send('sendMailPatient', mailDataPatient)
      .toPromise();

    await this.clientMailService
      .send('sendMailDoctor', mailDataDoctor)
      .toPromise();

    return result;
  }

  async findAll(status?: Status): Promise<Schedule[]> {
    if (status) {
      return await this.scheduleRepositories.find({
        where: {
          status: status,
        },
        relations: ['patient', 'doctor'],
      });
    }

    return await this.scheduleRepositories.find({
      relations: ['patient', 'doctor'],
    });
  }

  async findById(id: number): Promise<Schedule> {
    return await this.scheduleRepositories.findOne({ id: id });
  }

  async findByIdDoctor(id: number): Promise<Schedule> {
    return await this.scheduleRepositories.findOne({ doctorId: id });
  }

  async findByIdPatient(id: number): Promise<Schedule> {
    return await this.scheduleRepositories.findOne({ patientId: id });
  }
}
