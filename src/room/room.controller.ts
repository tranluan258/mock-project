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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(new JwtGuard(Role.Employee))
  @ApiBearerAuth()
  @Get('get-all-room')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    const result: Room[] = await this.roomService.findAll();
    return {
      message: 'List room',
      data: result,
    };
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @ApiBearerAuth()
  @Post('create-room')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoomDto: CreateRoomDto): Promise<object> {
    const result: Room = await this.roomService.create(createRoomDto);
    return {
      message: 'Create room success',
      data: result,
    };
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @ApiBearerAuth()
  @Put('update-room/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<object> {
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
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @ApiBearerAuth()
  @Delete('delete-room/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const result: DeleteResult = await this.roomService.delete(id);
    if (result.affected <= 0)
      throw new HttpException('Not found room', HttpStatus.NOT_FOUND);
    return {
      message: 'Delete room success',
      data: result,
    };
  }
}
