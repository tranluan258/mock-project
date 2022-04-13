import { CreatePermissionDto } from './dto/create-permission.dto';
import { Role } from 'src/account/enum/role.enum';
import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { PermissionService } from './permission.service';

@UseGuards(new JwtGuard(Role.Admin))
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

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
}
