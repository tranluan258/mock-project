import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty) private facultyRepositories: Repository<Faculty>,
  ) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    return await this.facultyRepositories.save(createFacultyDto);
  }

  async findAll(): Promise<Faculty[]> {
    return await this.facultyRepositories.find();
  }

  async findById(id: number): Promise<Faculty> {
    return await this.facultyRepositories.findOne({ id: id });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.facultyRepositories.delete(id);
  }

  async update(
    id: number,
    updateFacutyDto: UpdateFacultyDto,
  ): Promise<UpdateResult> {
    return await this.facultyRepositories.update(id, updateFacutyDto);
  }
}
