import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Permission } from 'src/permission/entities/permission.entity';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enum/role.enum';

@Entity()
export class Account {
  @ApiPropertyOptional({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({ length: 100, nullable: false, unique: true })
  username: string;

  @ApiProperty({ type: String })
  @Column({ length: 255, nullable: false })
  password: string;

  @ApiProperty({ enum: Role })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Employee,
  })
  role: Role;

  @ManyToMany(() => Permission, {
    cascade: true,
  })
  @JoinTable()
  permissions: Permission[];
}
