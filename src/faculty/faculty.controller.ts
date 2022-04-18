import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
  Param,
  ParseIntPipe,
  HttpException,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import { FacultyService } from './faculty.service';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @ApiBearerAuth()
  @Post('create-faculty')
  @UseGuards(new JwtGuard(Role.Admin))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFacultyDto: CreateFacultyDto): Promise<object> {
    const result: Faculty = await this.facultyService.create(createFacultyDto);
    return {
      message: 'Create faculty success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Get('get-all-faculty')
  @UseGuards(new JwtGuard(Role.Employee))
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    const result: Faculty[] = await this.facultyService.findAll();
    return {
      message: 'List faculty',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Put('update-faculty/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new JwtGuard(Role.Admin))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<object> {
    const result: UpdateResult = await this.facultyService.update(
      id,
      updateFacultyDto,
    );
    if (result.affected <= 0)
      throw new HttpException('Not found faculty', HttpStatus.NOT_FOUND);

    return {
      message: 'Update success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Delete('delete-faculty/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new JwtGuard(Role.Admin))
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const result: DeleteResult = await this.facultyService.delete(id);

    if (result.affected <= 0)
      throw new HttpException('Not found faculty', HttpStatus.NOT_FOUND);

    return {
      message: 'Delete success',
      data: result,
    };
  }
}
