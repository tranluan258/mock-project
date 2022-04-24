import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.EMAIL_SERVICE_HOST,
          port: parseInt(process.env.EMAIL_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
