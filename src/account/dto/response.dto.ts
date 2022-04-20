import { Account } from './../entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
export class ResponseAccountDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: Account;
}

export class ResponseListAccountDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Account, isArray: true })
  data: Account[];
}
