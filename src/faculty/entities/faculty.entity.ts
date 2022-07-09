import { Doctor } from './../../doctor/entities/doctor.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Faculty {
  @ApiPropertyOptional({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column('varchar', { length: 50 })
  name: string;

  @ApiProperty({ type: String })
  @Column('varchar', { length: 50 })
  details: string;

  @OneToMany(() => Schedule, (schedule) => schedule.faculty)
  schedule: Schedule[];

  @OneToMany(() => Doctor, (doctor) => doctor.faculty)
  doctors: Doctor[];
}
