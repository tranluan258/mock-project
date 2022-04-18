import { Role } from './enum/role.enum';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AddPermissionForAccountDto } from './dto/add-permission-account.dto';
@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAccountDto: CreateAccountDto): Promise<object> {
    const result = await this.accountService.create(createAccountDto);
    return {
      message: 'Create account success',
      data: result,
    };
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @Post('add-permission')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async addPermission(
    @Body() addPermissionForAccountDto: AddPermissionForAccountDto,
  ): Promise<object> {
    const result = await this.accountService.addPermission(
      addPermissionForAccountDto,
    );

    return {
      message: 'Add permission for account success',
      data: result,
    };
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @Get('get-all')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    const result = await this.accountService.findAll();
    return {
      message: 'List account',
      data: result,
    };
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @Delete('delete-account/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const result = await this.accountService.remove(id);
    if (result.affected <= 0)
      throw new HttpException('Not found account', HttpStatus.NOT_FOUND);
    return {
      message: 'Delete account success',
      data: result,
    };
  }
}
