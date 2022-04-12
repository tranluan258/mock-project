import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
}
