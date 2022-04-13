import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepositories: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createAccountDto.password, saltOrRounds);
    createAccountDto.password = hash;
    console.log(createAccountDto.password);
    return this.accountRepositories.save(createAccountDto);
  }

  async findOne(loginDto: LoginDto): Promise<Account> {
    const account = await this.accountRepositories.findOne({
      where: { username: loginDto.username },
      relations: ['permissions'],
    });

    if (!account) return null;
    const match = await bcrypt.compare(loginDto.password, account.password);
    if (!match) return null;

    return account;
  }
}
