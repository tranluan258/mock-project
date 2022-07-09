import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { AccountService } from './account.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, Repository } from 'typeorm';

const accountArr = [new Account(), new Account()];

describe('AccountController', () => {
  let accountService: AccountService;
  let id: number;
  let repo: Repository<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            find: jest.fn().mockResolvedValue(accountArr),
            findOne: jest.fn().mockResolvedValue(Account),
            create: jest.fn().mockReturnValue(Account),
            delete: jest.fn().mockResolvedValue(DeleteResult),
          },
        },
      ],
    }).compile();
    accountService = module.get<AccountService>(AccountService);
    repo = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });

  // describe('create-account', () => {
  //   it('should be return account create', async () => {
  //     const createAccountDto: CreateAccountDto = new CreateAccountDto();
  //     createAccountDto.username = 'NV2';
  //     createAccountDto.password = '123456';
  //     const result = await accountService.create(createAccountDto);
  //     id = result.id;
  //     expect(result).toBeInstanceOf(Account);
  //   });
  // });

  describe('findById-account', () => {
    it('should be return account', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      const result = await accountService.findById(1);
      expect(result).toEqual(Account);
      expect(repoSpy).toBeCalledWith({
        relations: ['permissions'],
        where: {
          id: 1,
        },
      });
    });
  });

  // describe('delete-account', () => {
  //   it('should be return delete result', async () => {
  //     const result = await accountService.remove(id);
  //     expect(result).toBeInstanceOf(DeleteResult);
  //   });
  // });

  describe('get-all-account', () => {
    it('should return list account', async () => {
      const result = await accountService.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });
});
