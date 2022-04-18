import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepositories: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return await this.permissionRepositories.save(createPermissionDto);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepositories.find();
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.permissionRepositories.delete(id);
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<UpdateResult> {
    return await this.permissionRepositories.update(id, updatePermissionDto);
  }
}
