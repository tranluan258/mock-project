import { AddPermissionForAccountDto } from './dto/add-permission-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getConnection, Repository } from 'typeorm';
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

  async addPermission(addPermissionForAccountDto: AddPermissionForAccountDto) {
    return await getConnection()
      .createQueryBuilder()
      .relation(Account, 'permissions')
      .of(addPermissionForAccountDto.accountId)
      .add(addPermissionForAccountDto.permissionId);
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepositories.find();
  }

  async findById(id: number): Promise<Account> {
    return await this.accountRepositories.findOne({ id: id });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.accountRepositories.delete(id);
  }
}
