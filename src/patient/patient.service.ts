import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepositories: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    return await this.patientRepositories.save(createPatientDto);
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientRepositories.find();
  }

  async findById(id: number): Promise<Patient> {
    return await this.patientRepositories.findOne({ id: id });
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<UpdateResult> {
    return await this.patientRepositories.update(id, updatePatientDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.patientRepositories.delete(id);
  }
}
