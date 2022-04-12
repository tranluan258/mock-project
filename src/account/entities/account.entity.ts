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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  username: string;

  @Column({ length: 255, nullable: false })
  password: string;

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
