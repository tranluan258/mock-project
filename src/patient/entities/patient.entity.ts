import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class Patient {
  @ApiPropertyOptional({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({ length: 50 })
  email: string;

  @ApiProperty({ type: String })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ type: Number })
  @Column()
  age: number;

  @ApiProperty({ type: String })
  @Column({ length: 200 })
  address: string;

  @OneToMany(() => Schedule, (schedule) => schedule.patient)
  schedule: Schedule[];
}
