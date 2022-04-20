import { Room } from './../entities/room.entity';
import { ApiProperty } from '@nestjs/swagger';
export class ResponseRoomDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Room })
  data: Room;
}

export class ResponseListRoomDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: Room, isArray: true })
  data: Room[];
}
