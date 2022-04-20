import { ApiProperty } from '@nestjs/swagger';
export class ResponseSignInDto {
  @ApiProperty()
  message: string;

  @ApiProperty({
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example: 'string',
      },
      refreshToken: {
        type: 'string',
        example: 'string',
      },
    },
  })
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
