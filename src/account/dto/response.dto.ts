import { Account } from './../entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
export class ResponseCreateDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: Account;
}

export class ResponseListDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Account, isArray: true })
  data: Account[];
}
