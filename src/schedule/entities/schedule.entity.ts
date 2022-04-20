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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Schedule {
  @ApiPropertyOptional({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: Status })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Create,
  })
  status: Status;

  @ApiProperty({ type: Date })
  @Column('date')
  dateExamination: Date;

  @ApiProperty({ type: Number })
  @Column('int')
  hours: number;

  @ApiProperty({ type: Number })
  @Column('int')
  price: number;

  @ApiProperty({ type: Date })
  @Column('datetime')
  dateCreated: Date;

  @ApiProperty({ type: Date })
  @Column('datetime')
  dateModified: Date;

  @ApiProperty({ type: Number })
  @Column({
    name: 'patient_id',
    select: false,
  })
  patientId: number;

  @ApiProperty({ type: Number })
  @Column({
    name: 'doctor_id',
    select: false,
  })
  doctorId: number;

  @ApiProperty({ type: Number })
  @Column({
    name: 'faculty_id',
    select: false,
  })
  facultyId: number;

  @ApiProperty({ type: Number })
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
