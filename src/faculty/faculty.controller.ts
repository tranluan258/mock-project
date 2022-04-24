import { ResponseFacultyDto, ResponseListFacultyDto } from './dto/reponse.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/account/enum/role.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import { FacultyService } from './faculty.service';
import { Logger } from 'winston';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(
    private readonly facultyService: FacultyService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseFacultyDto,
  })
  @Post('create-faculty')
  @UseGuards(new JwtGuard(Role.Admin))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFacultyDto: CreateFacultyDto): Promise<object> {
    try {
      const result: Faculty = await this.facultyService.create(
        createFacultyDto,
      );
      return {
        message: 'Create faculty success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error create faculty',
        error,
        context: 'FacultyController:create',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseListFacultyDto,
  })
  @Get('get-all-faculty')
  @UseGuards(new JwtGuard(Role.Employee))
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    try {
      const result: Faculty[] = await this.facultyService.findAll();
      return {
        message: 'List faculty',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error findAll faculty',
        error,
        context: 'FacultyController:findAll',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseFacultyDto,
  })
  @Get('get-faculty-by-id/:id')
  @UseGuards(new JwtGuard(Role.Employee))
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result: Faculty = await this.facultyService.findById(id);
      return {
        message: 'The faculty',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error findById faculty',
        error,
        context: 'FacultyController:findById',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Put('update-faculty/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new JwtGuard(Role.Admin))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<object> {
    try {
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
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error update faculty',
        error,
        context: 'FacultyController:update',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Delete('delete-faculty/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new JwtGuard(Role.Admin))
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result: DeleteResult = await this.facultyService.delete(id);

      if (result.affected <= 0)
        throw new HttpException('Not found faculty', HttpStatus.NOT_FOUND);

      return {
        message: 'Delete success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error delete faculty',
        error,
        context: 'FacultyController:delete',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
