import {
  Entity,
  ManyToOne,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Faculty } from '../../faculty/entities/faculty.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Room } from '../../room/entities/room.entity';
import 'reflect-metadata';
import { Status } from '../enum/status.enum';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Create,
  })
  status: string;

  @Column('date')
  dateExamination: Date;

  @Column('int')
  hours: number;

  @Column('int')
  price: number;

  @Column('datetime')
  dateCreated: Date;

  @Column('datetime')
  dateModified: Date;

  @Column({
    name: 'patient_id',
    select: false,
  })
  patientId: number;

  @Column({
    name: 'doctor_id',
    select: false,
  })
  doctorId: number;

  @Column({
    name: 'faculty_id',
    select: false,
  })
  facultyId: number;

  @Column({
    name: 'room_id',
    select: false,
  })
  roomId: number;

  @ManyToOne(() => Patient, (patient) => patient.schedule)
  @JoinColumn([{ name: 'patient_id', referencedColumnName: 'id' }])
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedule)
  @JoinColumn([{ name: 'doctor_id', referencedColumnName: 'id' }])
  doctor: Doctor;

  @ManyToOne(() => Faculty, (faculty) => faculty.schedule)
  @JoinColumn([{ name: 'faculty_id', referencedColumnName: 'id' }])
  faculty: Faculty;

  @ManyToOne(() => Room, (room) => room.schedule)
  @JoinColumn([{ name: 'room_id', referencedColumnName: 'id' }])
  room: Room;
}
