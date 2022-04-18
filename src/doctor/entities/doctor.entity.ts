import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToOne,
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

  @Column({
    name: 'faculty_id',
    select: false,
  })
  facultyId: number;

  @ManyToOne(() => Faculty)
  @JoinColumn([{ name: 'faculty_id', referencedColumnName: 'id' }])
  faculty: Faculty;

  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedule: Schedule[];
}
