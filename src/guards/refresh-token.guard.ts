import { AUTH_STRATEGY } from 'src/constants';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export class RefreshTokenGuard extends NestAuthGuard(
  AUTH_STRATEGY.REFRESH_TOKEN,
) {}
