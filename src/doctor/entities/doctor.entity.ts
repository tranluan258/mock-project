import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Faculty } from '../../faculty/entities/faculty.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column({ length: 60, nullable: false })
  email: string;

  @OneToOne(() => Faculty)
  @JoinColumn()
  faculty: Faculty;

  @OneToMany(() => Schedule, (schedule) => schedule.patient)
  schedule: Schedule[];
}
