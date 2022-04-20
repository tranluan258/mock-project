import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../entities/permission.entity';
export class ResponsePermissionDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Permission })
  data: Permission;
}

export class ResponseListPermissionDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Permission, isArray: true })
  data: Permission[];
}
