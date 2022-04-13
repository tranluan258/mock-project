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
import { ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginDto: LoginDto): Promise<object> {
    const result = await this.authService.login(loginDto);
    if (result == null)
      throw new HttpException('Not found account', HttpStatus.NOT_FOUND);

    const permission = {};
    const userPermission = result.permissions;
    userPermission?.forEach((value: any) => {
      const resource = value.resource;
      const action = value.action;
      permission[resource]
        ? permission[resource].push(action)
        : (permission[resource] = [action]);
    });

    const payload = {
      id: result.id,
      username: result.username,
      permission: permission,
      role: result.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH,
    });

    const findCache = await this.cacheManager.get(refreshToken);

    if (findCache) await this.cacheManager.del(refreshToken);

    await this.cacheManager.set(refreshToken, JSON.stringify(payload), {
      ttl: 0,
    }); // default set tll 5second, use tll=0 no limit

    return {
      message: 'Login success',
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOu(@Body() tokenDto: TokenDto): Promise<object> {
    await this.cacheManager.del(tokenDto.token);
    return {
      message: 'You are logged out',
    };
  }

  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() tokenDto: TokenDto): Promise<object> {
    const payload: object = JSON.parse(
      await this.cacheManager.get(tokenDto.token),
    );
    if (!payload)
      throw new HttpException(
        'Not found token you login again',
        HttpStatus.UNAUTHORIZED,
      );

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30m',
    });

    return {
      data: accessToken,
    };
  }
}
