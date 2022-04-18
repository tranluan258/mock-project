import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: number;

  @OneToMany(() => Schedule, (schedule) => schedule.room)
  schedule: Schedule[];
}
