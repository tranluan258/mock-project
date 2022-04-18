import { CreateDoctorDto } from './dto/create-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Doctor } from './entities/doctor.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor) private doctorRepositories: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return await this.doctorRepositories.save(createDoctorDto);
  }

  async findAll(): Promise<Doctor[]> {
	  return await this.doctorRepositories.find({
		  relations: ['faculty'],
	  });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.doctorRepositories.delete(id);
  }

  async update(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<UpdateResult> {
    return await this.doctorRepositories.update(id, updateDoctorDto);
  }
}
