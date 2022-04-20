import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Role } from 'src/account/enum/role.enum';
import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  HttpCode,
  Delete,
  Get,
  Inject,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { PermissionService } from './permission.service';
import { Logger } from 'winston';

@ApiTags('Permission')
@UseGuards(new JwtGuard(Role.Admin))
@Controller('permission')
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  @ApiBearerAuth()
  @Post('create-permission')
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<object> {
    try {
      const result = await this.permissionService.create(createPermissionDto);
      return {
        message: 'Create permission success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error create permission',
        error,
        context: 'PermissionController:create',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Get('get-all-permission')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    try {
      return await this.permissionService.findAll();
    } catch (error) {
      this.logger.error({
        message: 'Error findAll permission',
        error,
        context: 'PermissionController:findAll',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Delete('delete-permission/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result = await this.permissionService.remove(id);
      if (result.affected <= 0)
        throw new HttpException('Not found permission', HttpStatus.NOT_FOUND);
      return {
        message: 'Delete permission success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error delete permission',
        error,
        context: 'PermissionController:delete',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @Put('update-permission/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<object> {
    try {
      const result = await this.permissionService.update(
        id,
        updatePermissionDto,
      );
      if (result.affected <= 0)
        throw new HttpException('Not found permission', HttpStatus.NOT_FOUND);
      return {
        message: 'Update permission success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error update permission',
        error,
        context: 'PermissionController:update',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
