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
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { PermissionService } from './permission.service';

@ApiTags('Permission')
@UseGuards(new JwtGuard(Role.Admin))
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiBearerAuth()
  @Post('create-permission')
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<object> {
    const result = await this.permissionService.create(createPermissionDto);
    if (!result)
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);

    return {
      message: 'Create permission success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Get('get-all-permission')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    return await this.permissionService.findAll();
  }

  @ApiBearerAuth()
  @Delete('delete-permission/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const result = await this.permissionService.remove(id);
    if (result.affected <= 0)
      throw new HttpException('Not found permission', HttpStatus.NOT_FOUND);
    return {
      message: 'Delete permission success',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Put('update-permission/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<object> {
    const result = await this.permissionService.update(id, updatePermissionDto);
    if (result.affected <= 0)
      throw new HttpException('Not found permission', HttpStatus.NOT_FOUND);
    return {
      message: 'Update permission success',
      data: result,
    };
  }
}
