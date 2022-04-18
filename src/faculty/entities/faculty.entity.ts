import { Doctor } from './../../doctor/entities/doctor.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Faculty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 50 })
  details: string;

  @OneToMany(() => Schedule, (schedule) => schedule.faculty)
  schedule: Schedule[];

  @OneToMany(() => Doctor, (doctor) => doctor.faculty)
  doctors: Doctor[];
}
