import { AccountService } from './../account/account.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private accountService: AccountService) {}

  async login(loginDto: LoginDto): Promise<any> {
    const account = await this.accountService.findOne(loginDto);
    if (account == null) return null;
    const { password, ...rest } = account;
    return rest;
  }
}
