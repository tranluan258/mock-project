import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';
import { FacultyModule } from './faculty/faculty.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

const customLoggerFormatter = winston.format.printf((info) => {
  if (info.level == 'error' && info.error) {
    return `[${info.timestamp}] [${info.context}] [${info.level}] ${
      info.error.stack
    }\n${JSON.stringify(info.error, null, 4)}`;
  }

  return `[${info.timestamp}] [${info.context}] [${info.level}] ${info.message}`;
});
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
            customLoggerFormatter,
          ),
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
            customLoggerFormatter,
          ),
          filename: 'src/logs/combine.log',
        }),
      ],
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      isGlobal: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
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
    AuthModule,
  ],
})
export class AppModule {}
