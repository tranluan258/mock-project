import { CreatePermissionDto } from './create-permission.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
