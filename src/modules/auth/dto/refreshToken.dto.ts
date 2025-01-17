import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { OAUTH_GRANT_TYPE } from 'src/constants';

export class RefreshTokenDto {
  @IsEnum(OAUTH_GRANT_TYPE)
  @IsNotEmpty()
  grantType: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
