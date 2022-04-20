import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  @UseGuards(new JwtGuard(Role.Employee))
  @ApiBearerAuth()
  @Get('get-all-room')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    try {
      const result: Room[] = await this.roomService.findAll();
      return {
        message: 'List room',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error findAll room: ',
        error,
        context: 'RoomController:findAll',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @ApiBearerAuth()
  @Post('create-room')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoomDto: CreateRoomDto): Promise<object> {
    try {
      const result: Room = await this.roomService.create(createRoomDto);
      return {
        message: 'Create room success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error create room: ',
        error,
        context: 'RoomController:create',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @ApiBearerAuth()
  @Put('update-room/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<object> {
    try {
      const result: UpdateResult = await this.roomService.update(
        id,
        updateRoomDto,
      );
      if (result.affected <= 0)
        throw new HttpException('Not found room', HttpStatus.NOT_FOUND);
      return {
        message: 'Update room success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error update room: ',
        error,
        context: 'RoomController:update',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @ApiBearerAuth()
  @Delete('delete-room/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result: DeleteResult = await this.roomService.delete(id);
      if (result.affected <= 0)
        throw new HttpException('Not found room', HttpStatus.NOT_FOUND);
      return {
        message: 'Delete room success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error delete room: ',
        error,
        context: 'RoomController:delete',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
