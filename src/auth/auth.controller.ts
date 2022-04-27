import { ResponseSignInDto } from './dto/response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TokenDto } from './dto/token.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Logger } from 'winston';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseSignInDto,
  })
  async signIn(@Body() loginDto: LoginDto): Promise<object> {
    try {
      const account = await this.authService.login(loginDto);
      if (account == null)
        throw new HttpException('Not found account', HttpStatus.NOT_FOUND);

      const permission = {};
      const userPermission = account.permissions;
      userPermission?.forEach((value: any) => {
        const resource = value.resource;
        const action = value.action;
        permission[resource]
          ? permission[resource].push(action)
          : (permission[resource] = [action]);
      });

      const payload = {
        id: account.id,
        username: account.username,
        permission: permission,
        role: account.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m', // 30minutes
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH,
      });

      const findCache = await this.cacheManager.get(refreshToken);

      if (findCache) await this.cacheManager.del(refreshToken);

      await this.cacheManager.set(refreshToken, JSON.stringify(payload), {
        ttl: 60 * 40, // 40minutes
      }); // default set tll 5second, use tll=0 no limit

      return {
        message: 'Login success',
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());
      this.logger.error({
        message: 'Error login auth',
        error: error,
        context: 'AuthController:signIn',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@Body() tokenDto: TokenDto): Promise<object> {
    await this.cacheManager.del(tokenDto.token);
    return {
      message: 'You are logged out',
    };
  }

  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() tokenDto: TokenDto): Promise<object> {
    try {
      const payload: object = JSON.parse(
        await this.cacheManager.get(tokenDto.token),
      );

      if (!payload)
        throw new HttpException(
          'Not found token you login again',
          HttpStatus.UNAUTHORIZED,
        );

      await this.cacheManager.del(tokenDto.token);
      await this.cacheManager.set(tokenDto.token, payload, { ttl: 60 * 40 }); //set token in redis because tll expiresIn 40minutes;

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      });

      return {
        data: accessToken,
      };
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.getResponse(), error.getStatus());

      this.logger.error({
        message: 'Error refresh auth',
        error: error,
        context: 'AuthController:refreshToken',
      });
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
