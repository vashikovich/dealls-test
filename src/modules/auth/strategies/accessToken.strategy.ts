import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from 'src/modules/auth/interfaces';
import { AUTH_STRATEGY } from 'src/constants';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY.TOKEN,
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'super-secret', // Use environment variable in production
      passReqToCallback: true, // Pass the request to the callback function
    });
  }

  async validate(payload: JwtPayload) {
    return this.authService.validateUser(payload);
  }
}
