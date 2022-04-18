import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepositories: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.roomRepositories.save(createRoomDto);
  }

  async findAll(): Promise<Room[]> {
    return await this.roomRepositories.find();
  }

  async update(
    id: number,
    updateRoomDto: UpdateRoomDto,
  ): Promise<UpdateResult> {
    return await this.roomRepositories.update(id, updateRoomDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.roomRepositories.delete(id);
  }
}
