import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AssignScheduleDto } from './dto/assign-schedule.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { MailDataDto } from './dto/mail-data.dto';
import { Status } from './enum/status.enum';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DistanceDateDto } from './dto/distance-date.dto';
import e from 'express';

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

  async findAll(options: IPaginationOptions): Promise<Pagination<Schedule>> {
    const queryBuilder = this.scheduleRepositories
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.patient', 'patient')
      .leftJoinAndSelect('schedule.doctor', 'doctor');
    return paginate(queryBuilder, options);
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

  async assignSchedule(
    assignScheduleDto: AssignScheduleDto,
  ): Promise<UpdateResult> {
    return await this.scheduleRepositories
      .createQueryBuilder()
      .update(Schedule)
      .set({ status: assignScheduleDto.status })
      .where('id = :id', { id: assignScheduleDto.id })
      .where('status = :status', { status: Status.Create })
      .execute();
  }

  async updateSchedule(
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<UpdateResult> {
    return await this.scheduleRepositories.update(id, updateScheduleDto);
  }

  async findByDate(distanceDateDto: DistanceDateDto): Promise<Schedule[]> {
    const startDate = new Date(distanceDateDto.startDate);
    const endDate = new Date(distanceDateDto.endDate);

    return await this.scheduleRepositories
      .createQueryBuilder('schedule')
      .where('schedule.dateExamination >= :startDate', { startDate })
      .andWhere('schedule.dateExamination <= :endDate', { endDate })
      .leftJoinAndSelect('schedule.patient', 'patient')
      .leftJoinAndSelect('schedule.doctor', 'doctor')
      .getMany();
  }

  async statisticalTurnover(distanceDateDto: DistanceDateDto): Promise<number> {
    const startDate = new Date(distanceDateDto.startDate);
    const endDate = new Date(distanceDateDto.endDate);

    const result: Schedule[] = await this.scheduleRepositories
      .createQueryBuilder('schedule')
      .where('schedule.dateExamination >= :startDate', { startDate })
      .andWhere('schedule.dateExamination <= :endDate', { endDate })
      .select('schedule.price')
      .getMany();

    let total = 0;
    result.forEach((el) => {
      total += el.price;
    });

    return total;
  }

  async statisticalByPatient(
    distanceDateDto: DistanceDateDto,
  ): Promise<number> {
    const startDate = new Date(distanceDateDto.startDate);
    const endDate = new Date(distanceDateDto.endDate);

    return await this.scheduleRepositories
      .createQueryBuilder('schedule')
      .where('schedule.dateExamination >= :startDate', { startDate })
      .andWhere('schedule.dateExamination <= :endDate', { endDate })
      .select('schedule.patient')
      .getCount();
  }
}
