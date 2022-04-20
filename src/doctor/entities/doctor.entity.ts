import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @ApiProperty({ type: String })
  @Column({ length: 60, nullable: false })
  email: string;

  @ApiProperty({ type: Number })
  @Column({
    name: 'faculty_id',
    select: false,
  })
  facultyId: number;

  @ApiProperty({ type: Faculty })
  @ManyToOne(() => Faculty)
  @JoinColumn([{ name: 'faculty_id', referencedColumnName: 'id' }])
  faculty: Faculty;

  @ApiProperty({ type: Schedule, isArray: true })
  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedule: Schedule[];
}
