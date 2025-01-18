import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from 'src/modules/auth/interfaces';
import { AUTH_STRATEGY } from 'src/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY.TOKEN,
) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.accessSecret'),
      passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
