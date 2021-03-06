import { Account } from './entities/account.entity';
import { ResponseAccountDto, ResponseListAccountDto } from './dto/response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Role } from './enum/role.enum';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AddPermissionForAccountDto } from './dto/add-permission-account.dto';
import { Logger } from 'winston';
@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseAccountDto,
  })
  async create(@Body() createAccountDto: CreateAccountDto): Promise<object> {
    try {
      const result = await this.accountService.create(createAccountDto);
      if (result == null)
        return {
          message: 'Username is existed',
        };
      return {
        message: 'Create account success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error signUp account',
        error: error,
        context: 'AccountController:signUp',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @Post('add-permission')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async addPermission(
    @Body() addPermissionForAccountDto: AddPermissionForAccountDto,
  ): Promise<object> {
    try {
      const result = await this.accountService.addPermission(
        addPermissionForAccountDto,
      );

      return {
        message: 'Add permission for account success',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error addPermission account',
        error: error,
        context: 'AccountController:signIn',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @Get('get-all')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseListAccountDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<object> {
    try {
      const result = await this.accountService.findAll();
      return {
        message: 'List account',
        data: result,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error list account',
        error: error,
        context: 'AccountController:findAll',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @ApiBearerAuth()
  @Get('get-by-id/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseAccountDto,
  })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result: Account = await this.accountService.findById(id);
      if (!result)
        throw new HttpException('Not found account', HttpStatus.NOT_FOUND);
      return {
        message: 'Find account success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());
      this.logger.error({
        message: 'Error find account',
        error: error,
        context: 'AccountController:findById',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(new JwtGuard(Role.Admin))
  @Delete('delete-account/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<object> {
    try {
      const result = await this.accountService.remove(id);
      if (result.affected <= 0)
        throw new HttpException('Not found account', HttpStatus.NOT_FOUND);
      return {
        message: 'Delete account success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error delete account',
        error: error,
        context: 'AccountController:delete',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
