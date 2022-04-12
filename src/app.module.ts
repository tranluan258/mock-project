import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';
import { FacultyModule } from './faculty/faculty.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AccountModule,
    DoctorModule,
    PatientModule,
    RoomModule,
    ScheduleModule,
    FacultyModule,
    PermissionModule,
  ],
})
export class AppModule {}
