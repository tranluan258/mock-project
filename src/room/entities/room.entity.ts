import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class Room {
  @ApiPropertyOptional({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: Number })
  @Column()
  name: number;

  @OneToMany(() => Schedule, (schedule) => schedule.room)
  schedule: Schedule[];
}
