import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  age: number;

  @Column({ length: 200 })
  address: string;

  @OneToMany(() => Schedule, (schedule) => schedule.patient)
  schedule: Schedule[];
}
